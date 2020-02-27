using Umbraco.Core.Composing;

namespace UmbracoJAM.Feature.Headless.Examine
{
    //This is a composer which automatically appends the ExamineEvents component
    public class ExamineComposer : ComponentComposer<ExamineEvents>, IUserComposer
    {
        // you could override `Compose` if you wanted to do more things, but if it's just registering a component there's nothing else that needs to be done.
    }
}