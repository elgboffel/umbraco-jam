using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace UmbracoJAM.Foundation.Common.Helpers
{
    public static class JsonHelpers
    {
        public static bool TryParseJson(string value)
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
    }
}