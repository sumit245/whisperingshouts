using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WhisperingShouts
{
    /// <summary>
    /// Summary description for FileHandler
    /// </summary>
    public class FileHandler : IHttpHandler, System.Web.SessionState.IRequiresSessionState
    {

        public void ProcessRequest(HttpContext context)
        {
            if (context.Request.Files.Count > 0)
            {
                string profileid = "";
                string filename = "";
                string filenamewithoutURL = "";

                //if (context.Request.QueryString["profileid"] != null)
                profileid = Convert.ToString(HttpContext.Current.Session["profileid"]);

                HttpFileCollection files = context.Request.Files;

                for (int i = 0; i < files.Count; i++)
                {
                    HttpPostedFile file = files[i];
                    filenamewithoutURL = profileid + "_" + "PROFILE_PIC" + "_" + System.DateTime.Now.ToString("yyyy_MM_dd_hh_mm_ss") + System.IO.Path.GetExtension(file.FileName);
                    filename = "Album/ProfilePic/" + filenamewithoutURL;
                    string fname = context.Server.MapPath("~/Album/ProfilePic/" + filenamewithoutURL);
                    file.SaveAs(fname);
                    break;
                }
                context.Response.ContentType = "text/plain";
                context.Response.Write(filenamewithoutURL);
            }
            else
            {
                context.Response.ContentType = "text/plain";
                context.Response.Write("fail");
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}