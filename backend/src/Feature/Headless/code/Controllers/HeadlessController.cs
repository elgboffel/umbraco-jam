using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web.Http.Results;
using System.Web.Mvc;
using Examine;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Umbraco.Core.Logging;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Web;
using Umbraco.Web.Mvc;
using Umbraco.Web.WebApi;
using UmbracoJAM.Feature.UmbracoHeadless.Examine;
using UmbracoJAM.Feature.UmbracoHeadless.Mappers;

namespace UmbracoJAM.Feature.UmbracoHeadless.Controllers
{
    [PluginController("Api")]
    public class HeadlessController : UmbracoApiController
    {
        private readonly ISearcher _searcher;
        private readonly UmbracoContextReference _context;
        private readonly UmbracoContentMapper _contentMapper;
        private JsonSerializerSettings _camelCasingSerializerSettings = new JsonSerializerSettings();

        public HeadlessController(IUmbracoContextFactory context)
        {
            _context = context.EnsureUmbracoContext() ?? throw new Exception("UmbracoContext not found");
            _searcher =  ExamineSearchers.GetExternalIndexSearcher() ?? throw new Exception("ExternalIndex not found");
            _contentMapper = new UmbracoContentMapper(Umbraco);
            _camelCasingSerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
        }
        
        
        /// <summary>
        /// Route: /Umbraco/Api/Headless/GetContentById
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResult<Dictionary<string, object>> GetContentById(string id)
        {
            if (string.IsNullOrEmpty(id)) 
                throw new ArgumentNullException(nameof(id));
            
            var content = _context.UmbracoContext.Content.GetById(int.Parse(id));
            
            if (content == null) 
                throw new NoNullAllowedException(nameof(content));

            var mappedContent = _contentMapper.MapPublishedContent(content, true);
            
            Logger.Info<HeadlessController>("Action called: GetContentById");

            return Json(mappedContent, _camelCasingSerializerSettings);
        }
        
        
        /// <summary>
        /// Route: /Umbraco/Api/Headless/GetContentByRoute
        /// </summary>
        /// <returns></returns>
        [HttpGet]        
        public JsonResult<Dictionary<string, object>> GetContentByRoute(string route)
        {
            if (string.IsNullOrEmpty(route)) 
                throw new ArgumentNullException(nameof(route));
            
            var content = _context.UmbracoContext.Content.GetByRoute(route);
            
            if (content == null) 
                throw new NoNullAllowedException(nameof(content));
            
            var mappedContent = _contentMapper.MapPublishedContent(content, true);
            Logger.Info<HeadlessController>("Action called: GetContentByRoute - {route}", route);
            return Json(mappedContent, _camelCasingSerializerSettings);
        }
        

        /// <summary>
        /// Route: /Umbraco/Api/Headless/GetAllContent
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResult<IEnumerable<Dictionary<string, object>>> GetAllContent()
        {
            var contentAtRoot = _context.UmbracoContext.Content.GetAtRoot();
            
            if (contentAtRoot == null)
                throw new NoNullAllowedException(nameof(contentAtRoot));

            var allContent =
                from content in contentAtRoot.DescendantsOrSelf<IPublishedContent>()
                where content.TemplateId > 0
                select _contentMapper.MapPublishedContent(content, true);
            
            Logger.Info<HeadlessController>("Action called: GetAllContent");

            return Json(allContent, _camelCasingSerializerSettings);
        }
        
        /// <summary>
        /// Route: /Umbraco/Api/Headless/GetAllPaths
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResult<IEnumerable<UmbracoContentMapper.IPublishedPath>> GetAllPaths()
        {
            var contentAtRoot = _context.UmbracoContext.Content.GetAtRoot();
            
            if (contentAtRoot == null)
                throw new NoNullAllowedException(nameof(contentAtRoot));

            var pathsList = contentAtRoot
                .DescendantsOrSelf<IPublishedContent>()
                .Where(x => x.TemplateId > 0)
                .Select(x => _contentMapper.MapPublishedPath(x))
                .Where(x => x != null);
            
            Logger.Info<HeadlessController>("Action called: GetAllPaths");

            return Json(pathsList, _camelCasingSerializerSettings);
        }
    }
}