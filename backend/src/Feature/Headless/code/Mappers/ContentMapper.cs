using System.Collections.Generic;
using System.Linq;
using System.Web;
using ClientDependency.Core;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using StackExchange.Profiling.Internal;
using Umbraco.Core;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Web;

namespace UmbracoJAM.Feature.Headless.Mappers
{
    public static class ContentMapper
    {
        public static Dictionary<string, object> MapPublishedContent(
            this IPublishedContent content,
            UmbracoHelper helper,
            string[] propertiesToExclude = null)
        {
            propertiesToExclude = propertiesToExclude ?? new[] {"ChildrenForAllCultures", "Children", "Parent"};

            var type = typeof(IPublishedContent);
            
            var properties = type.GetProperties()
                .Where(property => !propertiesToExclude.Contains(property.Name))
                .ToDictionary(property => property.Name, property => property.GetValue(content, null));

            if (!content.Properties.Any()) return properties;

            var contentProperties = new Dictionary<string, object>();
            foreach (var property in content.Properties)
            {
                object value;
                var sourceValue = property.GetSourceValue()?.ToString();
                
                if (string.IsNullOrEmpty(sourceValue)) continue;

                switch (sourceValue)
                {
                    case var x when (sourceValue.Contains("ncContentTypeAlias")):
                        value = ConvertNestedContentSourceValueToObject(property.GetSourceValue()?.ToString());
                        break;
                    case var x when (sourceValue.Contains("umb://media")):
                        value = GetUmbracoMedia(helper, sourceValue);
                        break;
                    case var x when (sourceValue.Contains("umb://document")):
                        value = Test(JsonConvert.DeserializeObject(sourceValue)) ;
                        break;
                    default:
                        value = sourceValue;
                        break;
                }

                contentProperties.Add(property.Alias, value);
            }

            return properties
                .Concat(contentProperties)
                .ToDictionary(x => x.Key, x => x.Value);
        }

        private static object ConvertNestedContentSourceValueToObject(string value)
        {
            var valueToConvert = value?
                .Replace(@"\", string.Empty)
                .Replace("\"[", "[")
                .Replace("]\"", "]");
            
            return valueToConvert == null ? null : JsonConvert.DeserializeObject(valueToConvert);
        }

        private static string GetUmbracoMedia(UmbracoHelper helper, string value)
        {
            var media = helper.Media(value);

            return media == null ? string.Empty : $"{HttpContext.Current.Request.Url.Host}{media.Url}";
        }

        private static object Test(object value1)
        {
            var result = new Dictionary<string, object>();
            var type = value1.GetType();
            var properties = type.GetProperties();
            
            foreach (var (key, value) in value1.ToDictionary())
            {
                result.Add(key, value);
            }
            
            return value1;
        }
    }
}