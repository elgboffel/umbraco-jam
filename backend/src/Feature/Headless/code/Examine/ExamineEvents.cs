using System;
using System.Linq;
using System.Text;
using Examine;
using Examine.Providers;
using Umbraco.Core;
using Umbraco.Core.Composing;
using Umbraco.Examine;

namespace UmbracoJAM.Feature.Headless.Examine
{
    public class ExamineEvents : IComponent
    {
        private readonly IExamineManager _examineManager;

        public ExamineEvents(IExamineManager examineManager)
        {
            _examineManager = examineManager;
        }

        public void Initialize()
        {
            if (!_examineManager.TryGetIndex(Constants.UmbracoIndexes.ExternalIndexName, out IIndex index))
                throw new InvalidOperationException($"No index found by name {Constants.UmbracoIndexes.ExternalIndexName}");

            if (!(index is BaseIndexProvider indexProvider))
                throw new InvalidOperationException("Could not cast");

            indexProvider.TransformingIndexValues += IndexProviderTransformingIndexValues;
        }

        private void IndexProviderTransformingIndexValues(object sender, IndexingItemEventArgs e)
        {
            if (e.ValueSet.Category != IndexTypes.Content) return;
            
            var combinedFields = new StringBuilder();
                
            foreach (var fieldValues in e.ValueSet.Values)
            {
                var values = fieldValues.Value.Where(value => value != null);
                
                foreach (var value in values)
                {
                    combinedFields.AppendLine(value.ToString());
                }
            }

            e.ValueSet.TryAdd("combinedField", combinedFields.ToString());
        }

        public void Terminate()
        {
        }
    }
}