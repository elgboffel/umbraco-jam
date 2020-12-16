using System.Linq;
using HtmlAgilityPack;

namespace UmbracoJAM.Foundation.Common.Helpers
{
    public static class HtmlHelpers
    {
        public static bool IsHtml(string text)
        {
            var doc = new HtmlDocument();
            doc.LoadHtml(text);
            return !HtmlIsJustText(doc.DocumentNode);
        }

        public static bool HtmlIsJustText(HtmlNode rootNode)
        {
            return rootNode.Descendants().All(n => n.NodeType == HtmlNodeType.Text);
        }
    }
}