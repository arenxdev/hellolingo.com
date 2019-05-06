using System.Collections.Generic;
using System.Web.Http;
using Considerate.Hellolingo.WebApp.Models;

namespace Considerate.Hellolingo.WebApp.Controllers
{
    public class CheckpointController : ApiController
    {
	    public static List<int> SupportedClients = new List<int> { 166 };

	    [HttpPost]
	    [AllowAnonymous]
	    [Route("api/check")]
	    public WebApiResponse Check(CheckpointData data)
	    {
		    if (!SupportedClients.Contains(data.Version))
			    return new WebApiResponse(WebApiResponseMessage.NewClientRequired);
		    return new WebApiResponse();
	    }
	}

	public class CheckpointData
	{
		public int Version;
		public int? Count;
	}
	
}
