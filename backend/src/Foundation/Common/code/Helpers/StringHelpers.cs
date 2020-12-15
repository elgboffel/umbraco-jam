using System;

namespace UmbracoJAM.Foundation.Common.Helpers
{
    public static class StringHelpers
    {
        public static string FirstCharToUpper(string value)
        {
            if (string.IsNullOrEmpty(value)) return string.Empty;

            return char.ToUpper(value[0]) + value.Substring(1);
        }
        
        public static bool IsStringEmptyArray(string value)
        {
            if (string.IsNullOrEmpty(value)) return true;

            return value == "[]";
        }
        
        public static string GetStringBetween(string value, string first, string second)
        {
            if (!value.Contains(first)) return "";

            var afterFirst = value.Split(new[] {first}, StringSplitOptions.None)[1];

            if (!afterFirst.Contains(second)) return "";

            var result = afterFirst.Split(new[] {second}, StringSplitOptions.None)[0];

            return result;
        }
    }
}