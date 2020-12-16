using Examine;
using Umbraco.Core;
    
namespace UmbracoJAM.Feature.UmbracoHeadless.Examine
{
    public static class ExamineSearchers
    {
        public static ISearcher GetExternalIndexSearcher()
        {
            return GetExamineSearcher(Constants.UmbracoIndexes.ExternalIndexName);
        }
        
        private static ISearcher GetExamineSearcher(string indexName)
        {
            ExamineManager.Instance.TryGetIndex(indexName, out var index);
            return index.GetSearcher();
        }
    }
}