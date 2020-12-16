using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using HtmlAgilityPack;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Umbraco.Core;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Web;
using Umbraco.Web.PropertyEditors.ValueConverters;
using UmbracoJAM.Foundation.Common.Helpers;

namespace UmbracoJAM.Feature.UmbracoHeadless.Mappers
{
    public class UmbracoContentMapper
    {
        private readonly UmbracoHelper _helper;

        private readonly string[] _propertiesToExclude =
        {
            "ChildrenForAllCultures",
            "Children",
            "Parent",
            "itemType",
            "writerName",
            "writerId",
            "creatorId",
            "templateId"
        };

        public UmbracoContentMapper(UmbracoHelper helper)
        {
            _helper = helper ?? throw new ArgumentException(nameof(helper));
        }

        public interface IPublishedPath
        {
            int Id { get; set; }
            string Url { get; set; }
            IEnumerable<string> Slug { get; set; }
        }

        public class PublishedPath : IPublishedPath 
        {
            public int Id { get; set; }
            public string Url { get; set; }
            public IEnumerable<string> Slug { get; set; }
        }
        
        public Dictionary<string, object> MapPublishedContent(
            IPublishedContent content,
            bool withContext = false,
            string[] propertiesToExclude = null)
        {
            propertiesToExclude = propertiesToExclude ?? _propertiesToExclude;

            var type = typeof(IPublishedContent);

            var properties = type.GetProperties()
                .Where(property => !propertiesToExclude.Contains(property.Name))
                .ToDictionary(property => property.Name, property => property.GetValue(content, null));

            if (withContext)
                properties.Add("context", MapUmbracoContext(content));

            properties.Add("template", StringHelpers.FirstCharToUpper(content.GetTemplateAlias()));
            properties.Add("authentication", new
            {
                isProtected = _helper.MembershipHelper.IsProtected(content.Path),
            });

            if (content.HasValue("umbracoUrlRewrite"))
                properties["Url"] = content.GetProperty("umbracoUrlRewrite")?.Value();

            if (!content.Properties.Any()) return properties;

            var umbracoProperties = MapUmbracoProperties(content.Properties);

            return properties
                .Concat(umbracoProperties)
                .ToDictionary(x => x.Key, x => x.Value);
        }
        
        public IPublishedPath MapPublishedPath(IPublishedContent content)
        {
            var url = content.Url;

            // if (content.HasValue("umbracoUrlRewrite"))
            //     url = content.GetProperty("umbracoUrlRewrite").Value()?.ToString();

            return new PublishedPath
            {
                Id = content.Id,
                Url = content.Url,
                Slug = url?
                    .Split('/')
                    .Where(x => !x.IsNullOrWhiteSpace())
            };
        }

        private Dictionary<string, object> MapUmbracoContext(IPublishedContent content)
        {
            var settings =
                from child in content.AncestorOrSelf("culture")?.Children
                where child.ContentType.Alias == "settings"
                select child;

            var defaultSettings = settings.First();


            var context = new Dictionary<string, object>();

            if (defaultSettings != null)
                context.Add("settings", MapUmbracoSettings(defaultSettings));

            return context;
        }

        private Dictionary<string, object> MapUmbracoSettings(IPublishedContent settings)
        {
            if (settings == null)
                return null;

            var allDefaultSettings = settings
                .Descendants<IPublishedContent>()
                .ToList();

            if (!allDefaultSettings.Any())
                return null;

            var allSettings = new Dictionary<string, object>();

            foreach (var setting in allDefaultSettings)
            {
                var mappedSetting = MapPublishedContent(setting);
                allSettings.Add(setting.ContentType.Alias, mappedSetting);
            }

            return allSettings;
        }

        private Dictionary<string, object> MapUmbracoProperties(IEnumerable<IPublishedProperty> properties)
        {
            var props = new Dictionary<string, object>();
            foreach (var property in properties)
            {
                object value;
                var sourceValue = property.GetSourceValue()?.ToString();

                if (string.IsNullOrEmpty(sourceValue) || StringHelpers.IsStringEmptyArray(sourceValue)) continue;

                switch (true)
                {
                    case var x when (sourceValue.Contains("ncContentTypeAlias")):
                        value = MapUdisToPathFromJson(ConvertNestedContentSourceValueToObject(sourceValue) as JToken, _helper);
                        break;
                    case var x when HtmlHelpers.IsHtml(sourceValue):
                        value = MapUdiInHtml(sourceValue, _helper);
                        break;
                    case var x when (sourceValue.Contains("umb://media")):
                        value = GetUmbracoMedia(_helper, sourceValue);
                        break;
                    case var x when (property.PropertyType.EditorAlias == "Umbraco.MultiUrlPicker"):
                        value = JsonHelpers.TryParseJson(sourceValue)
                            ? MapUdisToPathFromJson(JsonConvert.DeserializeObject(sourceValue) as JToken, _helper)
                            : GetUmbracoUrl(sourceValue, _helper);
                        break;
                    case var x when (sourceValue.Contains("umb://document")):
                        value = JsonHelpers.TryParseJson(sourceValue)
                            ? MapUdisToPathFromJson(JsonConvert.DeserializeObject(sourceValue) as JToken, _helper)
                            : GetUmbracoUrl(sourceValue, _helper);
                        break;
                    default:
                        value = sourceValue;
                        break;
                }

                props.Add(property.Alias, value);
            }

            return props;
        }

        private object ConvertNestedContentSourceValueToObject(string value)
        {
            var valueToConvert = value?
                .Replace(@"\", string.Empty)
                .Replace("\"[", "[")
                .Replace("]\"", "]")
                .Replace("rn", "");

            return valueToConvert == null ? null : JsonConvert.DeserializeObject(valueToConvert);
        }

        private object MapUdisToPathFromJson(JToken jtoken, UmbracoHelper helper)
        {
            if (jtoken == null) return null;

            var tokens = jtoken.Children<JObject>().ToList();

            foreach (var token in tokens)
            {
                var properties = token.Properties().ToList();
                foreach (var property in properties)
                {
                    var value = property.Value;
                    var stringifiedValue = value.ToString();

                    switch (true)
                    {
                        case var x when value.Children().Any():
                            MapUdisToPathFromJson(value, helper);
                            break;
                        case var x when (stringifiedValue.Contains("umb://media")):
                            value.Replace(GetUmbracoMedia(helper, stringifiedValue));
                            break;
                        case var x when (stringifiedValue.Contains("umb://document")):
                            token.Add("url", GetUmbracoUrl(stringifiedValue, helper));
                            token.Add("template", GetUmbracoTemplateAlias(stringifiedValue, helper));
                            break;
                    }
                }
            }

            return tokens.Any()
                ? tokens
                : null;
        }

        private string GetUmbracoMedia(UmbracoHelper helper, string value)
        {
            var media = helper.Media(value);

            return media == null
                ? string.Empty
                : $"{HttpContext.Current.Request.Url.Scheme}://{HttpContext.Current.Request.Url.Authority}{media.Url}";
        }

        private string GetUmbracoUrl(string value, UmbracoHelper helper)
        {
            var content = helper.Content(value);

            return content == null
                ? string.Empty
                : $"{content.Url}";
        }

        private string GetUmbracoTemplateAlias(string value, UmbracoHelper helper)
        {
            var content = helper.Content(value);

            return content == null
                ? string.Empty
                : $"{StringHelpers.FirstCharToUpper(content.ContentType.Alias)}";
        }
        
        private string MapUdiInHtml(string html, UmbracoHelper helper)
        {
            var doc = new HtmlDocument();
            doc.LoadHtml(html);

            var links = doc.DocumentNode?.SelectNodes("//a[@href]");

            if (links != null && links.Any())
            {
                foreach (var link in links)
                {
                    var att = link.Attributes["href"];
                    var value = att.Value;

                    switch (true)
                    {
                        case var x when value.ContainsAny(new[] {"https://", "http://"}):
                            continue;
                        case var x when value.Contains("{localLink:umb"):
                            link.SetAttributeValue(
                                "href",
                                GetUmbracoUrl(StringHelpers.GetStringBetween(value, "{localLink:", "}"), helper));
                            break;
                        default:
                            continue;
                    }
                }
            }


            var images = doc.DocumentNode?.SelectNodes("//img[@src]");

            if (images == null || !images.Any()) return doc.DocumentNode?.InnerHtml;

            foreach (var img in images)
            {
                if (img == null)
                    continue;

                var att = img?.Attributes["src"];
                var udi = img?.Attributes["data-udi"]?.Value;
                img.SetAttributeValue("src", $"{GetUmbracoMedia(helper, udi)}{att.Value}");
            }

            return doc.DocumentNode?.InnerHtml;
        }
    }
}