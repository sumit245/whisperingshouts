using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace WhisperingShouts
{
    public partial class facebookshare : System.Web.UI.Page
    {
        public string title = string.Empty;
        public string image = string.Empty;
        public string caption = string.Empty;
        public string description = string.Empty;

        protected void Page_Load(object sender, EventArgs e)
        {
            title = Request.QueryString["name"];
            image = Request.QueryString["picture"];
            caption = Request.QueryString["caption"];
            description = Request.QueryString["description"];
            if (!string.IsNullOrEmpty(Convert.ToString(Request.QueryString["fbclid"])))
            {
                Response.Redirect("http://whisperingshouts.com/contests", false);
            }
        }
    }
}