using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http.Results;
using ClientDependency.Core;
using Examine;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Web;
using Umbraco.Web.Mvc;
using Umbraco.Web.WebApi;

namespace UmbracoJAM.Feature.Headless.Controllers
{
    [PluginController("Api")]
    public class HeadlessController : UmbracoApiController
    {
        private readonly IUmbracoContextFactory _umbracoContextFactory;
        private readonly ISearcher _searcher;

        public HeadlessController(IUmbracoContextFactory umbracoContextFactory)
        {
            ExamineManager.Instance.TryGetIndex("ExternalIndex", out var index);
            _umbracoContextFactory = umbracoContextFactory;
            _searcher = index.GetSearcher() ?? throw new Exception("ExternalIndex not found");
        }
        
        /// <summary>
        /// Route: /Umbraco/Api/Headless/GetNodeById
        /// </summary>
        /// <returns></returns>
        public JsonResult<IReadOnlyDictionary<string, string>> GetNodeById(string contentId)
        {
            if (string.IsNullOrEmpty(contentId)) 
                throw new Exception("GetNodeById did not receive contentId argument");
            
            var result = _searcher
                .CreateQuery("content")
                .Field("id", contentId)
                .Execute()
                .FirstOrDefault();
            
            if (result == null) 
                throw new Exception($"No Result found for content id: {contentId}");
            
            return Json(result.Values);
        }
    }
}