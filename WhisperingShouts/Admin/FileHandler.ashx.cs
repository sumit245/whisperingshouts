using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;

namespace WhisperingShouts.Admin
{
    /// <summary>
    /// Summary description for FileHandler
    /// </summary>
    public class FileHandler : IHttpHandler, System.Web.SessionState.IRequiresSessionState
    {
        RSQLConnection DBC = new RSQLConnection();
        public string error = string.Empty;
        public string successMsg = string.Empty;
        public void ProcessRequest(HttpContext context)
        {
            if (context.Request.Files.Count > 0)
            {
                //string filename = "";
                string filenamewithoutURL = "";
                string FileSuffix = "";
                string filepath = "";

                if (context.Request.QueryString["type"] != null)
                {
                    FileSuffix = Convert.ToString(context.Request.QueryString["type"]);
                }

                if (FileSuffix == "Rakeback")
                {
                    HttpFileCollection RakebackFiles = context.Request.Files;
                    HttpPostedFile file = RakebackFiles[0];
                    ProcessFile(file, context);

                    if (error == "")
                    {
                        context.Response.ContentType = "text/plain";
                        context.Response.Write("Rakeback has been updated");
                    }
                    else
                    {
                        context.Response.ContentType = "text/plain";
                        context.Response.Write(successMsg);
                    }
                    return;
                }

                switch (context.Request.QueryString["type"].ToLower())
                {
                    case "contestsimage":
                        filepath = "contests";
                        break;
                    case "blogimage":
                        filepath = "blog";
                        break;
                }

                HttpFileCollection files = context.Request.Files;

                for (int i = 0; i < files.Count; i++)
                {
                    HttpPostedFile file = files[i];
                    filenamewithoutURL = FileSuffix + "_" + System.DateTime.Now.ToString("yyyy_MM_dd_hh_mm_ss")
                        + System.IO.Path.GetExtension(file.FileName);
                    //filename = "Album/ProfilePic/" + filenamewithoutURL;
                    string fname = context.Server.MapPath("~/images/" + filepath + "/" + filenamewithoutURL);
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
        public void ProcessFile(HttpPostedFile file, HttpContext context)
        {
            if (CheckFileType(file.FileName))
            {
                String FileName = "";
                FileName = "Rakeback_" + System.DateTime.Now.ToString("yyyy_MM_dd_hh_mm_ss") + file.FileName.Substring(file.FileName.LastIndexOf("."), file.FileName.Length - file.FileName.LastIndexOf("."));
                file.SaveAs(context.Server.MapPath("Upload\\Rakeback") + "\\" + FileName);
                DataTable dt = CreateDataTableFromFile(context.Server.MapPath("Upload\\Rakeback") + "\\" + FileName, 1);
                if (insertData(dt, "Temp_Rakeback_Table"))
                {
                    int result = processData("ImportData_Rakeback");

                    if (result == 0 || result == -1)
                    {
                        error = "Data uploading fail please contact system administrator.";
                    }
                    else
                    {
                        successMsg = "Data has been successfully transferred.";
                    }
                }
                else
                {
                    error = "Data uploading fail please contact system administrator.";
                }
            }
            else
            {
                error = "Please select a .csv data file.";
            }

        }
        private Int32 processData(string procname)
        {

            Int16 Status = -1;
            if (DBC.isConnected)
            {
                try
                {
                    int result = DBC.ExecuteProcedureNonQuery(procname);
                    return System.Convert.ToInt32(result);
                }
                catch (SqlException ex)
                {
                    error = ex.Message; //"Data Uploading fail";
                                        // Utility.WriteError(ex.Message);
                    return -1;
                }
                catch (Exception ex)
                {
                    error = ex.Message; //"Data Uploading fail";
                                        //Utility.WriteError(ex.Message);
                    return -1;
                }
            }
            else
                return Status;
            //return Status;
        }
        private Boolean insertData(DataTable dt, string tbl)
        {
            try
            {
                DBC.Connect();
                DBC.Execute("truncate table " + tbl + " ");
                SqlBulkCopy bulkCopy = new SqlBulkCopy(DBC.Connection);

                bulkCopy.BulkCopyTimeout = 30000000;
                bulkCopy.DestinationTableName = tbl;

                bulkCopy.WriteToServer(dt);
                bulkCopy.Close();

            }
            catch (Exception ex)
            {
                //Utility.WriteError(ex.Message);
                return false;
            }
            return true;
        }
        private DataTable CreateDataTableFromFile(String fpath, int reptype)
        {
            DataTable dt = new DataTable();
            DataColumn dc;
            DataRow dr;
            try
            {
                StreamReader sr = new StreamReader(@fpath);
                string input;
                input = sr.ReadLine();

                if (input != "Identity,total_rakeback,cut_off,payable_amount,platform")
                    return null;

                string[] c = input.Split(new char[] { ',' });
                for (int i = 0; i < c.Length; i++)
                {
                    dc = new DataColumn();
                    dc.DataType = System.Type.GetType("System.String");
                    dc.ColumnName = c[i];
                    dc.Unique = false;
                    dt.Columns.Add(dc);
                }

                while ((input = sr.ReadLine()) != null)
                {
                    string[] s = input.Split(new char[] { ',' });
                    dr = dt.NewRow();
                    for (int i = 0; i < s.Length; i++)
                    {
                        dr[i] = s[i];
                    }
                    dt.Rows.Add(dr);
                }
                sr.Close();
            }
            catch (Exception ex)
            {
                //Utility.WriteError(ex.Message);
                return null;
            }
            return dt;
        }
        protected bool CheckFileType(string FileName)
        {
            string ext = Path.GetExtension(FileName);
            switch (ext.ToLower())
            {
                case ".csv":
                    return true;
                default:
                    return false;
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