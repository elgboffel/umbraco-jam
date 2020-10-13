using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using HtmlAgilityPack;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Umbraco.Core;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Web;

namespace UmbracoJAM.Feature.Headless.Mappers
{
    public class UmbracoContentMapper
    {

        private readonly UmbracoHelper _helper;
        private readonly string[] _propertiesToExclude = { "ChildrenForAllCultures", "Children", "Parent" };
        
        public UmbracoContentMapper(UmbracoHelper helper)
        {
            _helper = helper ?? throw new ArgumentException(nameof(helper));
        }

        public IEnumerable<string> MapPublishedPath(IPublishedContent content)
        {
            return content.Url
                .Split('/')
                .Where(x => !x.IsNullOrWhiteSpace());
        }
        
        public Dictionary<string, object> MapPublishedContent(
            IPublishedContent content,
            string[] propertiesToExclude = null)
        {
            propertiesToExclude = propertiesToExclude ?? _propertiesToExclude;

            var type = typeof(IPublishedContent);
            
            var properties = type.GetProperties()
                .Where(property => !propertiesToExclude.Contains(property.Name))
                .ToDictionary(property => property.Name, property => property.GetValue(content, null));

            var templateAlias = content.ContentType.Alias;
            
            properties.Add("template", char.ToUpper(templateAlias[0]) + templateAlias.Substring(1));
            
            if (!content.Properties.Any()) return properties;

            var umbracoProperties = MapUmbracoProperties(content.Properties);

            return properties
                .Concat(umbracoProperties)
                .ToDictionary(x => x.Key, x => x.Value);
        }

        private Dictionary<string, object> MapUmbracoProperties(IEnumerable<IPublishedProperty> properties)
        {
            var props = new Dictionary<string, object>();
            foreach (var property in properties)
            {
                object value;
                var sourceValue = property.GetSourceValue()?.ToString();
                
                if (string.IsNullOrEmpty(sourceValue)) continue;

                switch (true)
                {
                    case var x when (sourceValue.Contains("ncContentTypeAlias")):
                        value = MapUdisToPath(ConvertNestedContentSourceValueToObject(sourceValue) as JToken, _helper);
                        break;
                    case var x when IsHtml(sourceValue):
                        value = MapUdiInHtml(sourceValue, _helper);
                        break;
                    case var x when (sourceValue.Contains("umb://media")):
                        value = GetUmbracoMedia(_helper, sourceValue);
                        break;
                    case var x when (sourceValue.Contains("umb://document")):
                        value = TryParseJson(sourceValue) 
                            ? MapUdisToPath(JsonConvert.DeserializeObject(sourceValue) as JToken, _helper)
                            : GetUmbracoContent(sourceValue, _helper);
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
                .Replace("rn","");
            
            return valueToConvert == null ? null : JsonConvert.DeserializeObject(valueToConvert);
        }
        
        private object MapUdisToPath(JToken jtoken, UmbracoHelper helper)
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
                            MapUdisToPath(value, helper);
                            break;
                        case var x when (stringifiedValue.Contains("umb://media")):
                            value.Replace(GetUmbracoMedia(helper, stringifiedValue));
                            break;
                        case var x when (stringifiedValue.Contains("umb://document")):
                            token.Add("url", GetUmbracoContent(stringifiedValue, helper));
                            break;
                    }
                }
            }
            
            return tokens;
        }

        private string GetUmbracoMedia(UmbracoHelper helper, string value)
        {
            var media = helper.Media(value);

            return media == null 
                ? string.Empty 
                : $"{HttpContext.Current.Request.Url.Scheme}://{HttpContext.Current.Request.Url.Authority}{media.Url}";
        }        
        
        private string GetUmbracoContent(string value, UmbracoHelper helper)
        {
            var content = helper.Content(value);

            return content == null 
                ? string.Empty 
                : $"{content.Url}";
        }
        
        private string GetStringBetween(string token, string first, string second)
        {            
            if (!token.Contains(first)) return "";

            var afterFirst = token.Split(new[] { first }, StringSplitOptions.None)[1];

            if (!afterFirst.Contains(second)) return "";

            var result = afterFirst.Split(new[] { second }, StringSplitOptions.None)[0];

            return result;
        }
        
        private bool TryParseJson(string value)
        {
            try
            {
                JToken.Parse(value);
                return true;
            }
            catch (JsonReaderException)
            {
                return false;
            }
        }
        
        private bool IsHtml(string text)
        {
            var doc = new HtmlDocument();
            doc.LoadHtml(text);
            return !HtmlIsJustText(doc.DocumentNode);
        }
        
        private bool HtmlIsJustText(HtmlNode rootNode)
        {
            return rootNode.Descendants().All(n => n.NodeType == HtmlNodeType.Text);
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
                        case var x when value.ContainsAny(new [] {"https://", "http://"}):
                            continue;
                        case var x when value.Contains("{localLink:umb"):
                            link.SetAttributeValue(
                                "href", 
                                GetUmbracoContent(GetStringBetween(value,"{localLink:", "}"), helper));
                            break;
                        default:
                            continue;
                    }
                }  
            }


            var images = doc.DocumentNode?.SelectNodes("//img[@src]");

            if (images != null && images.Any())
            {
                foreach (var img in images)
                {
                    if (img == null) 
                        continue;
                
                    var att = img?.Attributes["src"];
                    var udi = img?.Attributes["data-udi"]?.Value;
                    img.SetAttributeValue("src", $"{GetUmbracoMedia(helper, udi)}{att.Value}");
                }  
            }


            return doc.DocumentNode.InnerHtml;
        }
    }
}