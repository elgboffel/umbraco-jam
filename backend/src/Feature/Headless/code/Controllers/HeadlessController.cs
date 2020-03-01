using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web.Http.Results;
using System.Web.Mvc;
using Examine;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Web;
using Umbraco.Web.Mvc;
using Umbraco.Web.WebApi;
using UmbracoJAM.Feature.Headless.Attributes;
using UmbracoJAM.Feature.Headless.Examine;
using UmbracoJAM.Feature.Headless.Mappers;

namespace UmbracoJAM.Feature.Headless.Controllers
{
    [PluginController("Api")]
    public class HeadlessController : UmbracoApiController
    {
        private readonly ISearcher _searcher;
        private readonly UmbracoContextReference _context;
        private readonly UmbracoContentMapper _contentMapper;

        public HeadlessController(IUmbracoContextFactory context)
        {
            _context = context.EnsureUmbracoContext() ?? throw new Exception("UmbracoContext not found");
            _searcher =  ExamineSearchers.GetExternalIndexSearcher() ?? throw new Exception("ExternalIndex not found");
            _contentMapper = new UmbracoContentMapper(Umbraco);
        }
        
        
        /// <summary>
        /// Route: /Umbraco/Api/Headless/GetContentById
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [CacheControl(MaxAge = 60)]
        public JsonResult<Dictionary<string, object>> GetContentById(string id)
        {
            if (string.IsNullOrEmpty(id)) 
                throw new ArgumentNullException(nameof(id));
            
            var content = _context.UmbracoContext.Content.GetById(int.Parse(id));
            
            if (content == null) 
                throw new NoNullAllowedException(nameof(content));

            var mappedContent = _contentMapper.MapPublishedContent(content);

            return Json(mappedContent);
        }
        
        
        /// <summary>
        /// Route: /Umbraco/Api/Headless/GetContentByRoute
        /// </summary>
        /// <returns></returns>
        [HttpGet]        
        [CacheControl(MaxAge = 60)]
        public JsonResult<Dictionary<string, object>> GetContentByRoute(string route)
        {
            if (string.IsNullOrEmpty(route)) 
                throw new ArgumentNullException(nameof(route));
            
            var content = _context.UmbracoContext.Content.GetByRoute(route);
            
            if (content == null) 
                throw new NoNullAllowedException(nameof(content));
            
            var mappedContent = _contentMapper.MapPublishedContent(content);

            return Json(mappedContent);
        }
        

        /// <summary>
        /// Route: /Umbraco/Api/Headless/GetAllContent
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [CacheControl(MaxAge = 60)]
        public JsonResult<IEnumerable<Dictionary<string, object>>> GetAllContent()
        {
            var contentAtRoot = _context.UmbracoContext.Content.GetAtRoot();
            
            if (contentAtRoot == null)
                throw new NoNullAllowedException(nameof(contentAtRoot));

            var contentList = contentAtRoot
                .DescendantsOrSelf<IPublishedContent>()
                .Select(x => _contentMapper.MapPublishedContent(x));

            return Json(contentList);
        }
    }
}