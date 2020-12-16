using System;
using System.Data;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using System.Web.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using ActionFilterAttribute = System.Web.Http.Filters.ActionFilterAttribute;

namespace UmbracoJAM.Feature.UmbracoHeadless.Attributes
{
    public class CamelCasePropertyNamesAttribute : ActionFilterAttribute
    {
        private readonly JsonMediaTypeFormatter _camelCasingFormatter = new JsonMediaTypeFormatter();

        public CamelCasePropertyNamesAttribute()
        {
            _camelCasingFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
        }

        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            if (!(actionExecutedContext.Response.Content is ObjectContent content)) return;
            
            if (content.Formatter is JsonMediaTypeFormatter)
            {
                actionExecutedContext.Response.Content = new ObjectContent(content.ObjectType, content.Value, _camelCasingFormatter);
            }
        }
    }
}