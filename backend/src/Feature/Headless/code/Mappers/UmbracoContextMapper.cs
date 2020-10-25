using System;
using System.Collections.Generic;
using System.Linq;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Web;

namespace UmbracoJAM.Feature.Headless.Mappers
{
    public  class UmbracoContextMapper
    {
        private readonly UmbracoHelper _helper;

        public UmbracoContextMapper(UmbracoHelper helper)
        {
            _helper = helper ?? throw new ArgumentException(nameof(helper));
        }


    }
}