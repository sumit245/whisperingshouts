using System;
using System.Configuration;
using System.Data;
using System.Data.Common;
using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System.Text.RegularExpressions;
using System.Text;
using System.Security.Cryptography;
using System.Net;
using System.IO;
using System.Net.Mail;
using Newtonsoft.Json.Linq;

namespace WhisperingShouts
{
    public class CommanClass
    {
        string connectionstring = ConfigurationManager.ConnectionStrings["mycon"].ConnectionString;
        public string passphrase = "DA0@6097A7370A$A5CAAB#DA85ACECC9DC1D";

        public DataTable Register(string username, string emailid, string mobileno, string password, string refrelcode, string latitude, string longitude, string IPaddress, string _DeviceType, string profileid)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_users"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@profileid", DbType.String, profileid);
                    objDB.AddInParameter(objCMD, "@name", DbType.String, username);
                    objDB.AddInParameter(objCMD, "@email_id", DbType.String, emailid);
                    objDB.AddInParameter(objCMD, "@mobile", DbType.String, mobileno);
                    objDB.AddInParameter(objCMD, "@password", DbType.String, password);
                    objDB.AddInParameter(objCMD, "@refrel_code", DbType.String, refrelcode);
                    objDB.AddInParameter(objCMD, "@ip_address", DbType.String, IPaddress);
                    objDB.AddInParameter(objCMD, "@latitude", DbType.String, latitude);
                    objDB.AddInParameter(objCMD, "@longitude", DbType.String, longitude);
                    objDB.AddInParameter(objCMD, "@device_type", DbType.String, _DeviceType);
                    
                    myDataSet = objDB.ExecuteDataSet(objCMD);

                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }

        public DataTable Login(string email_id, string password, string IPaddress, string latitude, string longitude, string _DeviceType, int IsLoginWithFaceBook, string name, string facebook_id)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_login"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@email_id", DbType.String, email_id);
                    objDB.AddInParameter(objCMD, "@password", DbType.String, password);
                    objDB.AddInParameter(objCMD, "@ip_address", DbType.String, IPaddress);
                    objDB.AddInParameter(objCMD, "@latitude", DbType.String, latitude);
                    objDB.AddInParameter(objCMD, "@longitude", DbType.String, longitude);
                    objDB.AddInParameter(objCMD, "@device_type", DbType.String, _DeviceType);
                    objDB.AddInParameter(objCMD, "@IsLoginWithFaceBook", DbType.Int32, IsLoginWithFaceBook);
                    objDB.AddInParameter(objCMD, "@name", DbType.String, name);
                    objDB.AddInParameter(objCMD, "@facebook_id", DbType.String, facebook_id);
                    myDataSet = objDB.ExecuteDataSet(objCMD);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }

        public DataTable ClickMap(string profileid, string button_name, string IPaddress, string _DeviceType)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_clickmap"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@profileid", DbType.String, profileid);
                    objDB.AddInParameter(objCMD, "@button_name", DbType.String, button_name);
                    objDB.AddInParameter(objCMD, "@ip_address", DbType.String, IPaddress);
                    objDB.AddInParameter(objCMD, "@device_type", DbType.String, _DeviceType);
                    myDataSet = objDB.ExecuteDataSet(objCMD);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }

        public DataTable ChangePassword(string token, string password)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_change_password"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@token", DbType.String, token);
                    objDB.AddInParameter(objCMD, "@password", DbType.String, password);
                    myDataSet = objDB.ExecuteDataSet(objCMD);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }

        public DataTable ForgotPassword(string email_id, string newpassword)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_forgot_password"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@email_id", DbType.String, email_id);
                    objDB.AddInParameter(objCMD, "@newpassword", DbType.String, newpassword);
                    myDataSet = objDB.ExecuteDataSet(objCMD);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }

        public DataTable Subscribe(string email_id, string ip_address)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_subscribers"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@email_id", DbType.String, email_id);
                    objDB.AddInParameter(objCMD, "@ip_address", DbType.String, ip_address);
                    myDataSet = objDB.ExecuteDataSet(objCMD);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }

        public DataTable GetDashboardData(string profileid)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_profile_data"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@profileid", DbType.String, profileid);
                    myDataSet = objDB.ExecuteDataSet(objCMD);

                }
                catch (Exception ex)
                {
                    //myDataSet = null;
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }

        public DataTable GetAdminDashboardData(string adminprofileid)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_admin_dashboard_data"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@adminprofileid", DbType.String, adminprofileid);
                    myDataSet = objDB.ExecuteDataSet(objCMD);

                }
                catch (Exception ex)
                {
                    //myDataSet = null;
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }

        public DataTable GetTransactionData(string profileid)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_profile_data"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@profileid", DbType.String, profileid);
                    myDataSet = objDB.ExecuteDataSet(objCMD);

                }
                catch (Exception ex)
                {
                    //myDataSet = null;
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 1)
                return myDataSet.Tables[1];
            else
                return null;
        }


        public DataTable GetReferAFriendData(string profileid)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_refer_a_friend"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@profileid", DbType.String, profileid);
                    myDataSet = objDB.ExecuteDataSet(objCMD);

                }
                catch (Exception ex)
                {
                    //myDataSet = null;
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }


        public DataTable WithdrawAmount(string profileid, decimal points)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_points_management"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@profileid", DbType.String, profileid);
                    objDB.AddInParameter(objCMD, "@points", DbType.Decimal, points);
                    objDB.AddInParameter(objCMD, "@trans_type", DbType.String, "W");
                    objDB.AddInParameter(objCMD, "@request_type", DbType.String, "withdraw");
                    myDataSet = objDB.ExecuteDataSet(objCMD);

                }
                catch (Exception ex)
                {
                    //myDataSet = null;
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }

        public DataTable AddPartnerUserName(string profileid, int PartnerID, string UserName)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_user_partner_mapping_master"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@profileid", DbType.String, profileid);
                    objDB.AddInParameter(objCMD, "@partner_id", DbType.Int32, PartnerID);
                    objDB.AddInParameter(objCMD, "@user_name", DbType.String, UserName);
                    myDataSet = objDB.ExecuteDataSet(objCMD);

                }
                catch (Exception ex)
                {
                    //myDataSet = null;
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }

        public DataTable GetAllPartners(string profileid, int partner_id)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_get_all_partner"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@profileid", DbType.String, profileid);
                    objDB.AddInParameter(objCMD, "@id", DbType.String, partner_id);
                    myDataSet = objDB.ExecuteDataSet(objCMD);

                }
                catch (Exception ex)
                {
                    //myDataSet = null;
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }

        public DataTable GetBlog(int id, string request_type)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_articles"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@id", DbType.Int32, id);
                    objDB.AddInParameter(objCMD, "@request_type", DbType.String, request_type);
                    myDataSet = objDB.ExecuteDataSet(objCMD);

                }
                catch (Exception ex)
                {
                    //myDataSet = null;
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }

        public DataTable GetContests(int id, string request_type)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_contests"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@id", DbType.Int32, id);
                    objDB.AddInParameter(objCMD, "@request_type", DbType.String, request_type);
                    myDataSet = objDB.ExecuteDataSet(objCMD);

                }
                catch (Exception ex)
                {
                    //myDataSet = null;
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }

        public DataTable GetContestsForUser(int contest_id, string profileid)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_contests_for_user"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@profileid", DbType.String, profileid);
                    objDB.AddInParameter(objCMD, "@contest_id", DbType.Int32, contest_id);
                    myDataSet = objDB.ExecuteDataSet(objCMD);

                }
                catch (Exception ex)
                {
                    //myDataSet = null;
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }


        public DataTable SubmitAnswer(string user_id, string QuestionID, string Answer, string entry_type, string person_id, int contest_id, string partner_user_name)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_contests_participations"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@user_id", DbType.String, user_id);
                    objDB.AddInParameter(objCMD, "@question_id", DbType.String, QuestionID);
                    objDB.AddInParameter(objCMD, "@answer", DbType.String, Answer);
                    objDB.AddInParameter(objCMD, "@person_id", DbType.String, person_id);
                    objDB.AddInParameter(objCMD, "@entry_type", DbType.String, entry_type);
                    objDB.AddInParameter(objCMD, "@contest_id", DbType.Int32, contest_id);
                    objDB.AddInParameter(objCMD, "@partner_user_name", DbType.String, partner_user_name);
                    myDataSet = objDB.ExecuteDataSet(objCMD);

                }
                catch (Exception ex)
                {
                    //myDataSet = null;
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }

        public DataTable AddUpdateBlog(string request_type, string title, string description, string image_file_name, string social_tag_description, string short_description, string id)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_articles"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@id", DbType.Int32, id);
                    objDB.AddInParameter(objCMD, "@title", DbType.String, title);
                    objDB.AddInParameter(objCMD, "@description", DbType.String, description);
                    objDB.AddInParameter(objCMD, "@image_file_name", DbType.String, image_file_name);
                    objDB.AddInParameter(objCMD, "@social_tag_description", DbType.String, social_tag_description);
                    objDB.AddInParameter(objCMD, "@short_description", DbType.String, short_description);
                    objDB.AddInParameter(objCMD, "@request_type", DbType.String, request_type);
                    myDataSet = objDB.ExecuteDataSet(objCMD);

                }
                catch (Exception ex)
                {
                    //myDataSet = null;
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }
        public DataTable AddUpdateContests(string request_type, string name, string description, string tnc , int type, string start_date, string end_date, string image_file_name, string id)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_contests"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@id", DbType.Int32, id);
                    objDB.AddInParameter(objCMD, "@name", DbType.String, name);
                    objDB.AddInParameter(objCMD, "@description", DbType.String, description);
                    objDB.AddInParameter(objCMD, "@tnc", DbType.String, tnc);
                    objDB.AddInParameter(objCMD, "@type", DbType.Int32, type);
                    objDB.AddInParameter(objCMD, "@start_date", DbType.String, start_date);
                    objDB.AddInParameter(objCMD, "@end_date", DbType.String, end_date);
                    objDB.AddInParameter(objCMD, "@image_file_name", DbType.String, image_file_name);
                    objDB.AddInParameter(objCMD, "@request_type", DbType.String, request_type);
                    myDataSet = objDB.ExecuteDataSet(objCMD);

                }
                catch (Exception ex)
                {
                    //myDataSet = null;
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }
        public DataTable ContactUs(string profileid, string name, string email, string subject, string message, string mobile, string ip_address)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_contactus"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@profileid", DbType.String, profileid);
                    objDB.AddInParameter(objCMD, "@name", DbType.String, name);
                    objDB.AddInParameter(objCMD, "@email", DbType.String, email);
                    objDB.AddInParameter(objCMD, "@subject", DbType.String, subject);
                    objDB.AddInParameter(objCMD, "@message", DbType.String, message);
                    objDB.AddInParameter(objCMD, "@ip_address", DbType.String, ip_address);
                    objDB.AddInParameter(objCMD, "@mobile", DbType.String, mobile);
                    myDataSet = objDB.ExecuteDataSet(objCMD);

                }
                catch (Exception ex)
                {
                    //myDataSet = null;
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }
        public DataTable GetNotification(int notifiable_id, int id, string content, bool read, string notifiable_type, string request_type)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_notifications"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@id", DbType.Int32, id);
                    objDB.AddInParameter(objCMD, "@content", DbType.String, content);
                    objDB.AddInParameter(objCMD, "@read", DbType.Boolean, read);
                    objDB.AddInParameter(objCMD, "@notifiable_id", DbType.Int32, notifiable_id);
                    objDB.AddInParameter(objCMD, "@notifiable_type", DbType.String, notifiable_type);
                    objDB.AddInParameter(objCMD, "@request_type", DbType.String, request_type);
                    myDataSet = objDB.ExecuteDataSet(objCMD);

                }
                catch (Exception ex)
                {
                    //myDataSet = null;
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }


        public DataTable ReadNotification(int notifiable_id, int id, string content, bool read, string notifiable_type, string request_type)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_notifications"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@id", DbType.Int32, id);
                    objDB.AddInParameter(objCMD, "@content", DbType.String, content);
                    objDB.AddInParameter(objCMD, "@read", DbType.Boolean, read);
                    objDB.AddInParameter(objCMD, "@notifiable_id", DbType.Int32, notifiable_id);
                    objDB.AddInParameter(objCMD, "@notifiable_type", DbType.String, notifiable_type);
                    objDB.AddInParameter(objCMD, "@request_type", DbType.String, request_type);
                    myDataSet = objDB.ExecuteDataSet(objCMD);

                }
                catch (Exception ex)
                {
                    //myDataSet = null;
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }

        public DataTable GetDeals(string profileid, int deals_id)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_deals"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@person_id", DbType.String, profileid);
                    objDB.AddInParameter(objCMD, "@deals_id", DbType.Int32, deals_id);
                    myDataSet = objDB.ExecuteDataSet(objCMD);

                }
                catch (Exception ex)
                {
                    //myDataSet = null;
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }

        public DataTable GetPartnerUserName(string profileid)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_profile_data"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@profileid", DbType.String, profileid);
                    myDataSet = objDB.ExecuteDataSet(objCMD);

                }
                catch (Exception ex)
                {
                    //myDataSet = null;
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 2)
                return myDataSet.Tables[2];
            else
                return null;
        }
        public DataTable GetLeaderboard(string profileid, int id, int rank, string type, string request_type)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_leaderboard"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@id", DbType.String, id);
                    objDB.AddInParameter(objCMD, "@person_id", DbType.String, profileid);
                    objDB.AddInParameter(objCMD, "@rank", DbType.String, rank);
                    objDB.AddInParameter(objCMD, "@type", DbType.String, type);
                    objDB.AddInParameter(objCMD, "@request_type", DbType.String, request_type);
                    myDataSet = objDB.ExecuteDataSet(objCMD);

                }
                catch (Exception ex)
                {
                    //myDataSet = null;
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }

        public DataTable GetContestResult(string profileid, int contest_id)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_contest_result"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@person_id", DbType.String, profileid);
                    objDB.AddInParameter(objCMD, "@contest_id", DbType.Int32, contest_id);
                    myDataSet = objDB.ExecuteDataSet(objCMD);

                }
                catch (Exception ex)
                {
                    //myDataSet = null;
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }

        public DataTable GetHomePageData(string person_id)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_home_data"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@person_id", DbType.String, person_id);
                    myDataSet = objDB.ExecuteDataSet(objCMD);
                }
                catch (Exception ex)
                {
                    //myDataSet = null;
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }

        public DataTable UpdateProfile(string username, string mobileno, string filename, string pancard, string aadhaarcard, string bankname, string bankaccount, string bankifsc, string bankupi, string profileid)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_users"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@profileid", DbType.String, profileid);
                    objDB.AddInParameter(objCMD, "@name", DbType.String, username);
                    objDB.AddInParameter(objCMD, "@mobile", DbType.String, mobileno);
                    objDB.AddInParameter(objCMD, "@filename", DbType.String, filename);
                    objDB.AddInParameter(objCMD, "@pancard", DbType.String, pancard);
                    objDB.AddInParameter(objCMD, "@aadhaar_card", DbType.String, aadhaarcard);
                    objDB.AddInParameter(objCMD, "@bank_name", DbType.String, bankname);
                    objDB.AddInParameter(objCMD, "@account_no", DbType.String, bankaccount);
                    objDB.AddInParameter(objCMD, "@IFSC", DbType.String, bankifsc);
                    objDB.AddInParameter(objCMD, "@UPI", DbType.String, bankupi);

                    //objDB.AddOutParameter(objCMD, "@IsRegistered", DbType.Int32, 8);

                    myDataSet = objDB.ExecuteDataSet(objCMD);

                    //int check = Convert.ToInt32(objDB.GetParameterValue(objCMD, "@check"));

                }
                catch (Exception ex)
                {
                    //myDataSet = null;
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }

        public DataTable GetRewardsData(string profileid)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_get_rewards"))
            {
                try
                {
                    if (!string.IsNullOrEmpty(profileid))
                        objDB.AddInParameter(objCMD, "@profileid", DbType.String, profileid);
                    //objDB.AddInParameter(objCMD, "@type", DbType.String, "Reward");
                    myDataSet = objDB.ExecuteDataSet(objCMD);

                }
                catch (Exception ex)
                {
                    //myDataSet = null;
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }


        public DataTable GetUpdatePartnerUserNameData(string type, string status, int id)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_get_update_partner_username"))
            {
                try
                {

                    objDB.AddInParameter(objCMD, "@type", DbType.String, type);
                    objDB.AddInParameter(objCMD, "@status", DbType.String, status);
                    objDB.AddInParameter(objCMD, "@id", DbType.Int32, id);
                    myDataSet = objDB.ExecuteDataSet(objCMD);

                }
                catch (Exception ex)
                {
                    //myDataSet = null;
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }



        public DataTable GetUpdateIdentities(string type, string status, string remarks, int id)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_identities"))
            {
                try
                {

                    objDB.AddInParameter(objCMD, "@type", DbType.String, type);
                    objDB.AddInParameter(objCMD, "@status", DbType.String, status);
                    objDB.AddInParameter(objCMD, "@remarks", DbType.String, remarks);
                    objDB.AddInParameter(objCMD, "@id", DbType.Int32, id);
                    myDataSet = objDB.ExecuteDataSet(objCMD);

                }
                catch (Exception ex)
                {
                    //myDataSet = null;
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }


        public DataTable GetUpdateKYCRequest(string type, string status, string remarks, int id)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_kyc_request"))
            {
                try
                {

                    objDB.AddInParameter(objCMD, "@type", DbType.String, type);
                    objDB.AddInParameter(objCMD, "@status", DbType.String, status);
                    objDB.AddInParameter(objCMD, "@remarks", DbType.String, remarks);
                    objDB.AddInParameter(objCMD, "@id", DbType.Int32, id);
                    myDataSet = objDB.ExecuteDataSet(objCMD);

                }
                catch (Exception ex)
                {
                    //myDataSet = null;
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }

        public DataTable GetUpdateAnnouncements(string type, string status, string content, int id)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_announcements"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@type", DbType.String, type);
                    objDB.AddInParameter(objCMD, "@content", DbType.String, content);
                    objDB.AddInParameter(objCMD, "@status", DbType.String, status);
                    objDB.AddInParameter(objCMD, "@id", DbType.Int32, id);
                    myDataSet = objDB.ExecuteDataSet(objCMD);

                }
                catch (Exception ex)
                {
                    //myDataSet = null;
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }
        public DataTable GetUpdateWithdrawRequestData(string type, string status, int id)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_get_update_wihdraw_request"))
            {
                try
                {

                    objDB.AddInParameter(objCMD, "@type", DbType.String, type);
                    objDB.AddInParameter(objCMD, "@status", DbType.String, status);
                    objDB.AddInParameter(objCMD, "@id", DbType.Int32, id);
                    myDataSet = objDB.ExecuteDataSet(objCMD);

                }
                catch (Exception ex)
                {
                    //myDataSet = null;
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }

        public DataTable GetUpdateRewardsData(string type, string reward_title, string reward_sub_title, string reward_image, string reward_value, string poker_room, string reward_code, string valid_till, string reward_description, int reward_id)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_get_update_reward"))
            {
                try
                {

                    objDB.AddInParameter(objCMD, "@type", DbType.String, type);
                    objDB.AddInParameter(objCMD, "@reward_title", DbType.String, reward_title);
                    objDB.AddInParameter(objCMD, "@reward_sub_title", DbType.String, reward_sub_title);
                    objDB.AddInParameter(objCMD, "@reward_image", DbType.String, reward_image);
                    objDB.AddInParameter(objCMD, "@reward_value", DbType.String, reward_value);
                    objDB.AddInParameter(objCMD, "@poker_room", DbType.String, poker_room);
                    objDB.AddInParameter(objCMD, "@reward_code", DbType.String, reward_code);
                    objDB.AddInParameter(objCMD, "@valid_till", DbType.String, valid_till);
                    objDB.AddInParameter(objCMD, "@reward_description", DbType.String, reward_description);
                    objDB.AddInParameter(objCMD, "@reward_id", DbType.Int32, reward_id);
                    myDataSet = objDB.ExecuteDataSet(objCMD);

                }
                catch (Exception ex)
                {
                    //myDataSet = null;
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }

        public DataTable GetUpdateUsersData(string type, string status, int id)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_get_update_users"))
            {
                try
                {

                    objDB.AddInParameter(objCMD, "@type", DbType.String, type);
                    //objDB.AddInParameter(objCMD, "@status", DbType.String, status);
                    objDB.AddInParameter(objCMD, "@profileid", DbType.Int32, id);
                    myDataSet = objDB.ExecuteDataSet(objCMD);

                }
                catch (Exception ex)
                {
                    //myDataSet = null;
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }
        public DataTable GetUpdatePartner(string type, int id)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_get_update_partners"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@type", DbType.String, type);
                    objDB.AddInParameter(objCMD, "@partner_id", DbType.Int32, id);
                    myDataSet = objDB.ExecuteDataSet(objCMD);

                }
                catch (Exception ex)
                {
                    //myDataSet = null;
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }

        public DataTable GetPassbook(string profileid)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_passbooks"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@person_id", DbType.String, profileid);
                    myDataSet = objDB.ExecuteDataSet(objCMD);
                }
                catch (Exception ex)
                {
                    //myDataSet = null;
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }


        public DataTable GetUpdateRakebackStats(int person_id, float amount, string description, string request_type)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_rakeback_stats"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@person_id", DbType.Int32, person_id);
                    objDB.AddInParameter(objCMD, "@amount", DbType.Decimal, amount);
                    objDB.AddInParameter(objCMD, "@description", DbType.String, description);
                    objDB.AddInParameter(objCMD, "@request_type", DbType.String, request_type);
                    myDataSet = objDB.ExecuteDataSet(objCMD);
                }
                catch (Exception ex)
                {
                    //myDataSet = null;
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }
        public DataSet generateOtp(string mobile, string otpType, string userType, string userId, string ipAddress, string deviceType)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("dbo.usp_otp"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@mobile", DbType.String, mobile);
                    objDB.AddInParameter(objCMD, "@userId ", DbType.String, userId);
                    objDB.AddInParameter(objCMD, "@ipAddress", DbType.String, ipAddress);
                    objDB.AddInParameter(objCMD, "@otpType", DbType.String, otpType);
                    objDB.AddInParameter(objCMD, "@deviceType", DbType.String, deviceType);
                    objDB.AddInParameter(objCMD, "@userType", DbType.String, userType);
                    myDataSet = objDB.ExecuteDataSet(objCMD);

                    if (myDataSet != null && myDataSet.Tables.Count > 0 && myDataSet.Tables[0].Rows.Count > 0)
                    {
                        foreach (DataRow dr in myDataSet.Tables[0].Rows)
                        {
                            if (Convert.ToString(dr["success"]) == "1" && Convert.ToString(dr["okToSendSMS"]) == "1")
                            {
                                string mobileNo = mobile;
                                string smsContent = Convert.ToString(dr["smsContent"]);
                                string smsSenderName = Convert.ToString(dr["smsSenderName"]);
                                string smsGateway = Convert.ToString(dr["smsGateway"]);

                                sendSMS(mobileNo, smsContent, smsSenderName, smsGateway);
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    myDataSet = null;
                }
            }

            return myDataSet;
        }
        public DataSet verifyOtp(string mobile, string otp, string otpType, string userType, string userId, string ipAddress, string deviceType)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("dbo.usp_verifyOtp"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@mobile", DbType.String, mobile);
                    objDB.AddInParameter(objCMD, "@userId ", DbType.String, userId);
                    objDB.AddInParameter(objCMD, "@otp", DbType.String, otp);
                    objDB.AddInParameter(objCMD, "@otpType", DbType.String, otpType);
                    objDB.AddInParameter(objCMD, "@ipAddress", DbType.String, ipAddress);
                    objDB.AddInParameter(objCMD, "@deviceType", DbType.String, deviceType);
                    objDB.AddInParameter(objCMD, "@userType", DbType.String, userType);
                    myDataSet = objDB.ExecuteDataSet(objCMD);
                }
                catch (Exception ex)
                {
                    myDataSet = null;
                }
            }

            return myDataSet;
        }
        public DataSet verifyIFSC(string ifscCode)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("dbo.usp_ifsc"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@ifscCode", DbType.String, ifscCode);
                    myDataSet = objDB.ExecuteDataSet(objCMD);
                }
                catch (Exception ex)
                {
                    myDataSet = null;
                }
            }

            return myDataSet;
        }

        public DataSet getBanner(int bannerId, string requestType)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("dbo.usp_banner"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@bannerId", DbType.Int32, bannerId);
                    objDB.AddInParameter(objCMD, "@requestType", DbType.String, requestType);
                    myDataSet = objDB.ExecuteDataSet(objCMD);
                }
                catch (Exception ex)
                {
                    myDataSet = null;
                }
            }

            return myDataSet;
        }

        public DataTable rummySignUp(string name, string email, string mobile, string IPaddress, string _DeviceType)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_rummySignUp"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@name", DbType.String, name);
                    objDB.AddInParameter(objCMD, "@email", DbType.String, email);
                    objDB.AddInParameter(objCMD, "@mobile", DbType.String, mobile);
                    objDB.AddInParameter(objCMD, "@ip_address", DbType.String, IPaddress);
                    objDB.AddInParameter(objCMD, "@device_type", DbType.String, _DeviceType);

                    //objDB.AddOutParameter(objCMD, "@IsRegistered", DbType.Int32, 8);

                    myDataSet = objDB.ExecuteDataSet(objCMD);

                    //int check = Convert.ToInt32(objDB.GetParameterValue(objCMD, "@check"));

                }
                catch (Exception ex)
                {
                    //myDataSet = null;
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }
        public string sendSMS(string mobileno, string smsContent, string senderName, string smsGateway)
        {
            //string ret = string.Empty;

            string ResponseString = string.Empty;
            //string StatusDescription = string.Empty;

            try
            {
                Stream dataStream = null;
                HttpWebRequest request = null;
                HttpWebResponse response = null;
                StreamReader reader = null;

                request = (HttpWebRequest)WebRequest.Create("" + smsGateway + "&mobile=+91" + mobileno + "&message=" + smsContent + "&senderid=" + senderName + "&accusage=1");

                request.Timeout = 1000 * 1000;
                request.Proxy = null;
                response = (HttpWebResponse)request.GetResponse();
                dataStream = response.GetResponseStream();
                reader = new StreamReader(dataStream);
                ResponseString = reader.ReadLine();

            }
            catch (WebException ex)
            {
                if (ex.Status == WebExceptionStatus.ProtocolError)
                {
                    HttpWebResponse err = ex.Response as HttpWebResponse;
                    if (err != null)
                    {
                        ResponseString = new StreamReader(err.GetResponseStream()).ReadToEnd();
                    }
                }
            }

            if (string.IsNullOrEmpty(ResponseString))
                ResponseString = "DND/Fail";

            smsLog(mobileno, smsContent, senderName, ResponseString);
            return ResponseString;

        }

        public DataSet smsLog(string mobileNo, string smsContent, string smsSenderName, string smsResponse)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("dbo.usp_smsLog"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@mobileNo", DbType.String, mobileNo);
                    objDB.AddInParameter(objCMD, "@smsContent", DbType.String, smsContent);
                    objDB.AddInParameter(objCMD, "@smsSenderName", DbType.String, smsSenderName);
                    objDB.AddInParameter(objCMD, "@smsResponse", DbType.String, smsResponse);
                    int i = objDB.ExecuteNonQuery(objCMD);
                }
                catch (Exception ex)
                {
                    myDataSet = null;
                }
            }

            return myDataSet;
        }
        //        [5:12 PM, 1/6/2021] Nikhil Arora: MTP Host: 180.179.151.1
        //SMTP Port: 25
        //Alternate SMTP Port: 587

        //UserName:- foxglovedemotx @m3c.io
        //Password:- Th5Ghp&78D@
        //[5:22 PM, 1/6/2021] Nikhil Arora: SMTP Host: 180.179.151.1
        //SMTP Port: 25
        //Alternate SMTP Port: 587

        //User Name: fc-demotx @m3c.io
        //Password: Th5Ghp&78D@
        public void sendMail(string empname, string to, string password)
        {
            //try
            //{
            //    MailMessage mail = new MailMessage();
            //    SmtpClient SmtpServer = new SmtpClient("smtp-relay.sendinblue.com");

            //    mail.From = new MailAddress("info@whisperingshouts.com");
            //    mail.To.Add(to);
            //    mail.Subject = "test";
            //    mail.Body = "Report";
            //    //Attachment attachment = new Attachment(filename);
            //    //mail.Attachments.Add(attachment);

            //    SmtpServer.Port = 25;
            //    SmtpServer.Credentials = new System.Net.NetworkCredential("fc-demotx@m3c.io", "Th5Ghp&78D@");
            //    SmtpServer.EnableSsl = true;

            //    SmtpServer.Send(mail);
            //}
            //catch (Exception ex)
            //{

            //}
            //return;
            //SmtpClient SmtpMail = new SmtpClient("smtp-relay.sendinblue.com");
            //SmtpMail.Port = 587;
            //SmtpMail.EnableSsl = true;
            //SmtpMail.Timeout = 100000;
            //SmtpMail.DeliveryMethod = SmtpDeliveryMethod.Network;
            //SmtpMail.UseDefaultCredentials = false;
            //SmtpMail.Credentials = new NetworkCredential(
            //    "nikhil@whisperingshouts.com", "zt8XSMKmO5JI4vQG");

            //SmtpClient SmtpMail = new SmtpClient("in-v3.mailjet.com");
            //SmtpMail.Port = 587;
            //SmtpMail.EnableSsl = true;
            //SmtpMail.Timeout = 100000;
            //SmtpMail.DeliveryMethod = SmtpDeliveryMethod.Network;
            //SmtpMail.UseDefaultCredentials = false;
            //SmtpMail.Credentials = new NetworkCredential(
            //    "1ea6f597d3a611baf2d7968549670c29", "e297255c824de58f26ccf674a589106e");

            SmtpClient SmtpMail = new SmtpClient("smtp.mandrillapp.com");
            SmtpMail.Port = 587;
            SmtpMail.EnableSsl = true;
            SmtpMail.Timeout = 100000;
            SmtpMail.DeliveryMethod = SmtpDeliveryMethod.Network;
            SmtpMail.UseDefaultCredentials = false;
            SmtpMail.Credentials = new NetworkCredential(
                "Whispering Shouts", "AKVobFBKNAZ5idjfCcHOZw");

            //System.Configuration.ConfigurationManager.AppSettings["Sender"].ToString(), System.Configuration.ConfigurationManager.AppSettings["Sender_pwd"].ToString());
            //SmtpMail.EnableSsl = false;


            string from = string.Empty;
            //from = System.Configuration.ConfigurationManager.AppSettings["Sender"].ToString();

            string Msg;
            String Subject = "Forget Password";

            MailMessage MailMsg = new MailMessage();
            {
                {
                    Msg = "<html><head></head>";
                    Msg += "<body>";
                    Msg += "<form id='form1' runat='server'>";
                    Msg += "<div><table>";
                    Msg += "<tr><td>Dear " + empname + " ,<br /><br /></td></tr>";
                    Msg += "<tr><td>your login id is: "+ to + " </td><tr>";
                    Msg += "<tr><td>your password is: " + password + " </td><tr>";
                    Msg += "<tr><td style='height:30px'></td></tr>";
                    Msg += "<tr><td>Thank you,<br /></td></tr>";
                    Msg += "<tr><td>Team Whispering Shouts<br /></td></tr>";
                    Msg += "</table></div></form></body></html>";
                    try
                    {
                        MailMsg.IsBodyHtml = true;
                        MailMsg.Body = Msg;
                        MailMsg.To.Clear();
                        //MailMsg.From = new MailAddress(from);
                        //MailMsg.From = new MailAddress(System.Configuration.ConfigurationManager.AppSettings["Sender"].ToString(), "Anmol Ratna");
                        MailMsg.From = new MailAddress("info@whisperingshouts.com", "Whispering Shouts");
                        MailMsg.To.Add(new MailAddress(to));

                        MailMsg.Subject = Subject;
                        //SmtpMail.Host = SMTPServer;
                        SmtpMail.Send(MailMsg);
                    }
                    catch (Exception ex)
                    {

                    }
                }
            }
        }

        public void sendWelcomeMail(string name, string to)
        {
            try
            {
                string from = string.Empty;

                string Msg;
                String Subject = "Welcome to Whispering Shouts!";

                Msg = "<div>Hey " + name + ",</div>";
                Msg += "<div>&nbsp;</div>";
                Msg += "<div>My name is Nikhil, and I am the Co-CEO of Whispering Shouts.</div>";
                Msg += "<div>&nbsp;</div>";
                Msg += "<div>I could not be happier to welcome you to the Whispering Shouts community and to help you start building your bankroll stronger with our amazing Rakeback deals.</div>";
                Msg += "<div>&nbsp;</div>";
                Msg += "<div>No matter the size of your bankroll, you can be sure that you will find the tools that you need... and maybe a few that you did not even know you needed yet! Our immense offerings will bring in a lot of opportunities for you to size up your game.</div>";
                Msg += "<div>&nbsp;</div>";
                Msg += "<div>If you have any questions, do not hesitate to reach out. My team and I will be ready to help you in any way we can.</div>";
                Msg += "<div>&nbsp;</div>";
                Msg += "<div>Happy Rakeback to you!</div>";

                System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;

                var baseAddress = "https://api.transmail.com/v1.1/email";

                var http = (HttpWebRequest)WebRequest.Create(new Uri(baseAddress));
                http.Accept = "application/json";
                http.ContentType = "application/json";
                http.Method = "POST";
                http.PreAuthenticate = true;
                http.Headers.Add("Authorization", "Zoho-enczapikey wSsVR610/EX3Cfx0zz34JucwzQlVAg+jQx5/jlSmviT/T6uU9sc9lkfPVAKiTfBNEjNuEDFArO9/nBgJ1TcOjd94zAoFCyiF9mqRe1U4J3x17qnvhDzJV2pamxuBJYgNwAlrnGFiEM4m+g==");
                JObject parsedContent = JObject.Parse("{'bounce_address':'info@bounce.whisperingshouts.com','from': { 'address': 'info@whisperingshouts.com'},'to': [{'email_address': {'address': '" + to + "'}}],'subject':'" + Subject + "','htmlbody':'" + Msg + "'}");
                Console.WriteLine(parsedContent.ToString());
                ASCIIEncoding encoding = new ASCIIEncoding();
                Byte[] bytes = encoding.GetBytes(parsedContent.ToString());

                Stream newStream = http.GetRequestStream();
                newStream.Write(bytes, 0, bytes.Length);
                newStream.Close();

                var response = http.GetResponse();

                var stream = response.GetResponseStream();
                var sr = new StreamReader(stream);
                var content = sr.ReadToEnd();
                //Console.WriteLine(content);

                WriteError("Mail Sent");
            }
            catch (Exception ex)
            {
                WriteError(ex.ToString());
            }

            //SmtpClient SmtpMail = new SmtpClient("smtp-relay.sendinblue.com");
            //SmtpMail.Port = 587;
            //SmtpMail.EnableSsl = true;
            //SmtpMail.Timeout = 100000;
            //SmtpMail.DeliveryMethod = SmtpDeliveryMethod.Network;
            //SmtpMail.UseDefaultCredentials = false;
            //SmtpMail.Credentials = new NetworkCredential(
            //    "nikhil@whisperingshouts.com", "zt8XSMKmO5JI4vQG");

            //SmtpClient SmtpMail = new SmtpClient("in-v3.mailjet.com");
            //SmtpMail.Port = 587;
            //SmtpMail.EnableSsl = true;
            //SmtpMail.Timeout = 100000;
            //SmtpMail.DeliveryMethod = SmtpDeliveryMethod.Network;
            //SmtpMail.UseDefaultCredentials = false;
            //SmtpMail.Credentials = new NetworkCredential(
            //    "1ea6f597d3a611baf2d7968549670c29", "e297255c824de58f26ccf674a589106e");


            //SmtpClient SmtpMail = new SmtpClient("smtp.mandrillapp.com");
            //SmtpMail.Port = 587;
            //SmtpMail.EnableSsl = true;
            //SmtpMail.Timeout = 100000;
            //SmtpMail.DeliveryMethod = SmtpDeliveryMethod.Network;
            //SmtpMail.UseDefaultCredentials = false;
            //SmtpMail.Credentials = new NetworkCredential(
            //    "Whispering Shouts", "AKVobFBKNAZ5idjfCcHOZw");

            //string from = string.Empty;

            //string Msg;
            //String Subject = "Welcome to Whispering Shouts!";

            //MailMessage MailMsg = new MailMessage();
            //{
            //    {
            //        Msg = "<div>Hey "+ name + ",</div>";
            //        Msg += "<div>&nbsp;</div>";
            //        Msg += "<div>My name is Nikhil, and I'm the Co-CEO of Whispering Shouts.</div>";
            //        Msg += "<div>&nbsp;</div>";
            //        Msg += "<div>I couldn't be happier to welcome you to the Whispering Shouts community and to help you start building your bankroll stronger with our amazing Rakeback deals.</div>";
            //        Msg += "<div>&nbsp;</div>";
            //        Msg += "<div>No matter the size or industry of your bankroll, you can be sure that you'll find the tools that you need... and maybe a few that you didn't even know you needed yet! Our immense offerings will bring in a lot of opportunities for you to size up your game.</div>";
            //        Msg += "<div>&nbsp;</div>";
            //        Msg += "<div>If you have any questions, don't hesitate to reach out. My team and I will be ready to help you in any way we can.</div>";
            //        Msg += "<div>&nbsp;</div>";
            //        Msg += "<div>Happy Rakeback to you!</div>";
            //        try
            //        {
            //            MailMsg.IsBodyHtml = true;
            //            MailMsg.Body = Msg;
            //            MailMsg.To.Clear();
            //            MailMsg.From = new MailAddress("info@whisperingshouts.com", "Whispering Shouts");
            //            MailMsg.To.Add(new MailAddress(to));

            //            MailMsg.Subject = Subject;
            //            SmtpMail.Send(MailMsg);
            //        }
            //        catch (Exception ex)
            //        {

            //        }
            //    }
            //}
        }
        public DataTable EmailVerification(string emailId, string requestType, string emailVerificationToken)
        {
            Database objDB = new SqlDatabase(connectionstring);
            DataSet myDataSet = new DataSet();

            using (DbCommand objCMD = objDB.GetStoredProcCommand("usp_emailVerification"))
            {
                try
                {
                    objDB.AddInParameter(objCMD, "@emailId", DbType.String, emailId);
                    objDB.AddInParameter(objCMD, "@requestType", DbType.String, requestType);
                    objDB.AddInParameter(objCMD, "@emailVerificationToken", DbType.String, emailVerificationToken);
                    myDataSet = objDB.ExecuteDataSet(objCMD);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }

            if (myDataSet != null && myDataSet.Tables.Count > 0)
                return myDataSet.Tables[0];
            else
                return null;
        }
        public void sendVerificationMail(string name, string email, string _token)
        {
            try
            {
                string from = string.Empty;

                string Msg;
                String Subject = "Welcome to Whispering Shouts!";

                Msg = "<div>Hey " + name + ",</div>";
                Msg += "<div>&nbsp;</div>";
                Msg += "<div>Thanks for registering for an account on Whispering Shouts! Before we get started, we just need to confirm that this is you.</div>";
                Msg += "<div>&nbsp;</div>";
                Msg += "<div>Click below to verify your email address:</div>";
                Msg += "<div>&nbsp;</div>";
                Msg += "<div>https://whisperingshouts.com/email-verification/" + _token + "</div>";

                System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;

                var baseAddress = "https://api.transmail.com/v1.1/email";

                var http = (HttpWebRequest)WebRequest.Create(new Uri(baseAddress));
                http.Accept = "application/json";
                http.ContentType = "application/json";
                http.Method = "POST";
                http.PreAuthenticate = true;
                http.Headers.Add("Authorization", "Zoho-enczapikey wSsVR610/EX3Cfx0zz34JucwzQlVAg+jQx5/jlSmviT/T6uU9sc9lkfPVAKiTfBNEjNuEDFArO9/nBgJ1TcOjd94zAoFCyiF9mqRe1U4J3x17qnvhDzJV2pamxuBJYgNwAlrnGFiEM4m+g==");
                JObject parsedContent = JObject.Parse("{'bounce_address':'info@bounce.whisperingshouts.com','from': { 'address': 'info@whisperingshouts.com'},'to': [{'email_address': {'address': '" + email + "'}}],'subject':'" + Subject + "','htmlbody':'" + Msg + "'}");
                Console.WriteLine(parsedContent.ToString());
                ASCIIEncoding encoding = new ASCIIEncoding();
                Byte[] bytes = encoding.GetBytes(parsedContent.ToString());

                Stream newStream = http.GetRequestStream();
                newStream.Write(bytes, 0, bytes.Length);
                newStream.Close();

                var response = http.GetResponse();

                var stream = response.GetResponseStream();
                var sr = new StreamReader(stream);
                var content = sr.ReadToEnd();
                //Console.WriteLine(content);

                WriteError("Mail Sent");
            }
            catch (Exception ex)
            {
                WriteError(ex.ToString());
            }
        }

        //public void sendForgotPasswordMail(string emailid, string password, string reset_password_token, string name)
        //{
        //    //SmtpClient SmtpMail = new SmtpClient("smtp-relay.sendinblue.com");
        //    //SmtpMail.Port = 587;
        //    //SmtpMail.EnableSsl = true;
        //    //SmtpMail.Timeout = 100000;
        //    //SmtpMail.DeliveryMethod = SmtpDeliveryMethod.Network;
        //    //SmtpMail.UseDefaultCredentials = false;
        //    //SmtpMail.Credentials = new NetworkCredential(
        //    //    "nikhil@whisperingshouts.com", "zt8XSMKmO5JI4vQG");

        //    //SmtpClient SmtpMail = new SmtpClient("in-v3.mailjet.com");
        //    //SmtpMail.Port = 587;
        //    //SmtpMail.EnableSsl = true;
        //    //SmtpMail.Timeout = 100000;
        //    //SmtpMail.DeliveryMethod = SmtpDeliveryMethod.Network;
        //    //SmtpMail.UseDefaultCredentials = false;
        //    //SmtpMail.Credentials = new NetworkCredential(
        //    //    "1ea6f597d3a611baf2d7968549670c29", "e297255c824de58f26ccf674a589106e");

        //    //SmtpClient SmtpMail = new SmtpClient("smtp.mandrillapp.com");
        //    //SmtpMail.Port = 25;
        //    //SmtpMail.EnableSsl = false;
        //    //SmtpMail.Timeout = 100000;
        //    //SmtpMail.DeliveryMethod = SmtpDeliveryMethod.Network;
        //    //SmtpMail.UseDefaultCredentials = false;
        //    //SmtpMail.Credentials = new NetworkCredential(
        //    //    "Whispering Shouts", "AKVobFBKNAZ5idjfCcHOZw");

        //    SmtpClient SmtpMail = new SmtpClient("smtp.transmail.co.in");
        //    SmtpMail.Port = 587;
        //    SmtpMail.EnableSsl = true;
        //    SmtpMail.Timeout = 100000;
        //    SmtpMail.DeliveryMethod = SmtpDeliveryMethod.Network;
        //    SmtpMail.UseDefaultCredentials = false;
        //    SmtpMail.Credentials = new NetworkCredential(
        //        "transmail@whisperingshouts.com", "wSsVR610/EX3Cfx0zz34JucwzQlVAg+jQx5/jlSmviT/T6uU9sc9lkfPVAKiTfBNEjNuEDFArO9/nBgJ1TcOjd94zAoFCyiF9mqRe1U4J3x17qnvhDzJV2pamxuBJYgNwAlrnGFiEM4m+g==");

        //    string from = string.Empty;

        //    string Msg;
        //    String Subject = "Forgot Password";

        //    MailMessage MailMsg = new MailMessage();
        //    {
        //        {
        //            Msg = "<div>Dear " + name + ",</div>";
        //            Msg += "<div>&nbsp;</div>";
        //            Msg += "<div>You are receiving this mail because we received a request from your user id to generate a new password.Here is the link which you can use to generate your new password (https://whisperingshouts.com/change-password/" + reset_password_token + ").</div>";
        //            Msg += "<div>&nbsp;</div>";
        //            Msg += "<div>If in &nbsp;case you did not request a new password then contact us immediately at info@whisperingshouts.com as someone maybe trying to get unauthorized access to your account.</div>";
        //            Msg += "<div>&nbsp;</div>";
        //            //Msg += "<div>Happy Rakeback to you!</div>";
        //            try
        //            {
        //                MailMsg.IsBodyHtml = true;
        //                MailMsg.Body = Msg;
        //                MailMsg.To.Clear();
        //                MailMsg.From = new MailAddress("transmail@whisperingshouts.com", "Whispering Shouts");
        //                MailMsg.To.Add(new MailAddress(emailid));

        //                MailMsg.Subject = Subject;
        //                SmtpMail.Send(MailMsg);

        //                WriteError("Mail Sent");
        //            }
        //            catch (Exception ex)
        //            {
        //                WriteError(ex.ToString());
        //            }
        //        }
        //    }
        //}
        public void sendForgotPasswordMail(string emailid, string password, string reset_password_token, string name)
        {
            try
            {
                string from = string.Empty;

                string Msg;
                String Subject = "Forgot Password";

                Msg = "<div>Dear " + name + ",</div>";
                Msg += "<div>&nbsp;</div>";
                Msg += "<div>You are receiving this mail because we received a request from your user id to generate a new password.Here is the link which you can use to generate your new password (https://whisperingshouts.com/change-password/" + reset_password_token + ").</div>";
                Msg += "<div>&nbsp;</div>";
                Msg += "<div>If in &nbsp;case you did not request a new password then contact us immediately at info@whisperingshouts.com as someone maybe trying to get unauthorized access to your account.</div>";
                Msg += "<div>&nbsp;</div>";

                System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;

                var baseAddress = "https://api.transmail.com/v1.1/email";

                var http = (HttpWebRequest)WebRequest.Create(new Uri(baseAddress));
                http.Accept = "application/json";
                http.ContentType = "application/json";
                http.Method = "POST";
                http.PreAuthenticate = true;
                http.Headers.Add("Authorization", "Zoho-enczapikey wSsVR610/EX3Cfx0zz34JucwzQlVAg+jQx5/jlSmviT/T6uU9sc9lkfPVAKiTfBNEjNuEDFArO9/nBgJ1TcOjd94zAoFCyiF9mqRe1U4J3x17qnvhDzJV2pamxuBJYgNwAlrnGFiEM4m+g==");
                JObject parsedContent = JObject.Parse("{'bounce_address':'info@bounce.whisperingshouts.com','from': { 'address': 'info@whisperingshouts.com'},'to': [{'email_address': {'address': '" + emailid + "'}}],'subject':'" + Subject + "','htmlbody':'" + Msg + "'}");
                Console.WriteLine(parsedContent.ToString());
                ASCIIEncoding encoding = new ASCIIEncoding();
                Byte[] bytes = encoding.GetBytes(parsedContent.ToString());

                Stream newStream = http.GetRequestStream();
                newStream.Write(bytes, 0, bytes.Length);
                newStream.Close();

                var response = http.GetResponse();

                var stream = response.GetResponseStream();
                var sr = new StreamReader(stream);
                var content = sr.ReadToEnd();
                //Console.WriteLine(content);

                WriteError("Mail Sent");
            }
            catch (Exception ex)
            {
                WriteError(ex.ToString());
            }


        }
        public void WriteError(string errorMessage)
        {
            try
            {
                if (errorMessage.StartsWith("Thread") == true)
                { }
                else if (errorMessage.Contains("Thread was being aborted"))
                { }
                else
                {
                    string path = "Error/" + DateTime.Today.ToString("dd-MM-yy") + ".txt";
                    if (!File.Exists(System.Web.HttpContext.Current.Server.MapPath(path)))
                    {
                        File.Create(System.Web.HttpContext.Current.Server.MapPath(path)).Close();
                    }
                    using (StreamWriter w = File.AppendText(System.Web.HttpContext.Current.Server.MapPath(path)))
                    {
                        w.WriteLine("\r\nLog Entry : ");
                        w.WriteLine("{0}", DateTime.Now.ToString(System.Globalization.CultureInfo.InvariantCulture));
                        string err = "Error in: " + System.Web.HttpContext.Current.Request.Url.ToString() +
                                      ". Error Message:" + errorMessage +
                                      ". IP:" + GetIPAddress();
                        w.WriteLine(err);
                        w.WriteLine("__________________________");
                        w.Flush();
                        w.Close();
                    }

                }
            }
            catch (Exception ex)
            {

            }
        }
        public string GetIPAddress()
        {
            System.Web.HttpContext context = System.Web.HttpContext.Current;
            string sIPAddress = context.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
            if (string.IsNullOrEmpty(sIPAddress))
            {
                return context.Request.ServerVariables["REMOTE_ADDR"];
            }
            else
            {
                string[] ipArray = sIPAddress.Split(new Char[] { ',' });
                return ipArray[0];
            }
        }
        public Boolean CheckEmail(string EmailId)
        {
            bool isvalid = true;
            if (!String.IsNullOrEmpty(EmailId))
            {
                Regex regex = new Regex(@"([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)");
                if (!regex.IsMatch(EmailId))
                {
                    isvalid = false;
                }
            }
            else
            {
                isvalid = false;
            }
            return isvalid;
        }



        public string EncryptPassword(string message)
        {
            //string passphrase = "DA0@6097A7370A$A5CAAB#DA85ACECC9DC1D";

            byte[] results;
            UTF8Encoding utf8 = new UTF8Encoding();
            //to create the object for UTF8Encoding  class
            //TO create the object for MD5CryptoServiceProvider
            MD5CryptoServiceProvider md5 = new MD5CryptoServiceProvider();
            byte[] deskey = md5.ComputeHash(utf8.GetBytes(passphrase));
            //to convert to binary passkey
            //TO create the object for  TripleDESCryptoServiceProvider
            TripleDESCryptoServiceProvider desalg = new TripleDESCryptoServiceProvider();
            desalg.Key = deskey;//to  pass encode key
            desalg.Mode = CipherMode.ECB;
            desalg.Padding = PaddingMode.PKCS7;
            byte[] encrypt_data = utf8.GetBytes(message);
            //to convert the string to utf encoding binary

            try
            {
                //To transform the utf binary code to md5 encrypt   
                ICryptoTransform encryptor = desalg.CreateEncryptor();
                results = encryptor.TransformFinalBlock(encrypt_data, 0, encrypt_data.Length);
            }
            finally
            {
                //to clear the allocated memory
                desalg.Clear();
                md5.Clear();
            }
            //to convert to 64 bit string from converted md5 algorithm binary code
            return Convert.ToBase64String(results);

        }
        public string DecryptPassword(string message)
        {
            //string passphrase = Convert.ToString(System.Configuration.ConfigurationManager.AppSettings["PassPhrase"]);


            byte[] results;
            UTF8Encoding utf8 = new UTF8Encoding();
            MD5CryptoServiceProvider md5 = new MD5CryptoServiceProvider();
            byte[] deskey = md5.ComputeHash(utf8.GetBytes(passphrase));
            TripleDESCryptoServiceProvider desalg = new TripleDESCryptoServiceProvider();
            desalg.Key = deskey;
            desalg.Mode = CipherMode.ECB;
            desalg.Padding = PaddingMode.PKCS7;
            byte[] decrypt_data = Convert.FromBase64String(message);
            try
            {
                //To transform the utf binary code to md5 decrypt
                ICryptoTransform decryptor = desalg.CreateDecryptor();
                results = decryptor.TransformFinalBlock(decrypt_data, 0, decrypt_data.Length);
            }
            finally
            {
                desalg.Clear();
                md5.Clear();

            }
            //TO convert decrypted binery code to string
            return utf8.GetString(results);
        }
    }
}