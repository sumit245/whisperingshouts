using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Services;
using System.Data;
using System.Net.Mail;
using System.Net;
using Newtonsoft.Json;
using System.Xml.Linq;

namespace WhisperingShouts
{

    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    
    [System.Web.Script.Services.ScriptService]
    public class WhisperingShoutsService : System.Web.Services.WebService
    {

        CommanClass commanbll = new CommanClass();
        Razorpay _Razorpay = new Razorpay();

        private static int Minimum_Length = 8;
        private static int Upper_Case_length = 1;
        private static int Lower_Case_length = 1;
        private static int NonAlpha_length = 1;
        private static int Numeric_length = 1;

        [WebMethod]
        public string HelloWorld()
        {
            return "Hello World";
        }

        [WebMethod(EnableSession = true)]
        public string CheckSession()
        {
            //Paytm _Paytm = new Paytm();
            //_Paytm.DisburseStatus();

            //string response = _Razorpay.CreateContact();

            //commanbll.sendWelcomeMail("Nikhil", "thewhisperingshouts@gmail.com");
            //commanbll.sendWelcomeMail("Nikhil", "girishkumar486@gmail.com");

            //commanbll.sendWelcomeMail("Signup test", "support@whisperingshouts.com");

            string returntype = string.Empty;
            try
            {
                string profileid = Convert.ToString(Session["profileid"]);
                if (profileid != "")
                {
                    returntype = "success";
                }
                else
                {
                    returntype = "fail";
                }
            }
            catch (Exception ex) { WriteError(ex.Message); }
            return returntype;
        }


        [WebMethod(EnableSession = true)]
        public int GetTimeRemainingForQuiz()
        {
            int _IsRecordOK = 0;
            //int TimeRemaining = 06 * 38 * 09;
            //return (6 * 60 * 60);

            //DateTime EndTime = System.DateTime.Now;
            //if (1 == 1)
            //{
            //    return Convert.ToString(System.DateTime.Now.AddHours(1));// 1 * 60 * 1;
            //}
            //return Convert.ToString(System.DateTime.Now.AddHours(1));// 1 * 60 * 1;
            //if (1 == 2 && Session["QuizEndDateTime"] != null && Convert.ToDateTime(Session["QuizEndDateTime"]) > EndTime)
            //{
            //    return Convert.ToString(Session["QuizEndDateTime"]);// 1 * 60 * 1;
            //}
            //else
            //{
            //    return Convert.ToString(System.DateTime.Now.AddHours(1));// 1 * 60 * 1;
            //}

            return 10;
        }


        [WebMethod(EnableSession = true)]
        public string Register(string username, string emailid, string mobileno
            , string password, string refrelcode, string latitude, string longitude)
        {
            string _DeviceType = GetDeviceType();
            string IPaddress = GetIPAddress();
            string profileid = Convert.ToString(Session["profileid"]);

            string encryptedpassword = commanbll.EncryptPassword(password);

            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.Register(username, emailid, mobileno, encryptedpassword, refrelcode, latitude
                , longitude, IPaddress, _DeviceType, profileid);

            if (myDataTable != null && myDataTable.Rows.Count > 0 && Convert.ToString(myDataTable.Rows[0]["ResponseType"]) == "success")
            {
                if (string.IsNullOrEmpty(profileid))
                {
                    commanbll.sendWelcomeMail(username, emailid);
                }
                DataTable myDataTable1 = new DataTable();
                myDataTable1 = commanbll.EmailVerification(emailid, "GET", string.Empty);
                if (myDataTable1 != null && myDataTable1.Rows.Count > 0
                    && Convert.ToString(myDataTable1.Rows[0]["IsSuccess"]) == "1")
                {
                    string emailVerificationToken = Convert.ToString(myDataTable1.Rows[0]["emailVerificationToken"]);
                    string name = Convert.ToString(myDataTable1.Rows[0]["name"]);
                    commanbll.sendVerificationMail(name, emailid, emailVerificationToken);
                }
                //Session["Program"] = Convert.ToString(myDataTable.Rows[0]["Program"]);
            }
            return JsonConvert.SerializeObject(myDataTable);
        }
        [WebMethod(EnableSession = true)]
        public string VerifyEmail(string emailid, string token)
        {
            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.EmailVerification(emailid, "UPDATE", token);
            return JsonConvert.SerializeObject(myDataTable);
        }

        [WebMethod(EnableSession = true)]
        public string Login(string userid, string password, string latitude, string longitude, int IsLoginWithFaceBook
            , string name, string facebook_id)
        {
            string _DeviceType = GetDeviceType();
            string IPaddress = GetIPAddress();

            //string decryptedpassword = commanbll.DecryptPassword(password);
            string encryptedpassword = commanbll.EncryptPassword(password);

            string aa = commanbll.DecryptPassword("fLyI+BPKccClrLgtQslmFA==");

            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.Login(userid, encryptedpassword, IPaddress, latitude, longitude, _DeviceType, IsLoginWithFaceBook, name, facebook_id);

            if (myDataTable != null && myDataTable.Rows.Count > 0
                && Convert.ToString(myDataTable.Rows[0]["IsSuccess"]) == "1")
            {
                Session["profileid"] = Convert.ToString(myDataTable.Rows[0]["id"]);
            }
            return JsonConvert.SerializeObject(myDataTable);
        }


        [WebMethod(EnableSession = true)]
        public string ClickMap(string name)
        {
            string _DeviceType = GetDeviceType();
            string IPaddress = GetIPAddress();
            string profileid = Convert.ToString(Session["profileid"]);

            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.ClickMap(profileid, name, IPaddress, _DeviceType);
            return JsonConvert.SerializeObject(myDataTable);
        }

        [WebMethod(EnableSession = true)]
        public string GetContest(int contest_id, string request_type)
        {
            string _DeviceType = GetDeviceType();
            string IPaddress = GetIPAddress();
            string profileid = Convert.ToString(Session["profileid"]);

            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.GetContests(contest_id, request_type);
            return JsonConvert.SerializeObject(myDataTable);
        }

        [WebMethod(EnableSession = true)]
        public string ChangePassword(string token, string password, string confpassword)
        {
            string _DeviceType = GetDeviceType();
            string IPaddress = GetIPAddress();
            bool _isokay = true;
            string Altstr = "";
            DataTable myDataTable = new DataTable();

            if (password != confpassword)
            {
                _isokay = false;
                Altstr += "*confirm password didn't match with new password.\\n";
            }
            if (!IsValid(password))
            {
                _isokay = false;
                Altstr += "*Your password must be 8 characters and must contain : upper case letter, lower case letter, number, symbol.\\n";
            }

            if (_isokay)
            {
                string encryptedpassword = commanbll.EncryptPassword(password);
                myDataTable = commanbll.ChangePassword(token, encryptedpassword);
                return JsonConvert.SerializeObject(myDataTable);
            }
            else
            {
                DataTable dt = new DataTable();
                dt.Clear();
                dt.Columns.Add("IsSuccess");
                dt.Columns.Add("ResponseMSG");
                dt.Columns.Add("ResponseType");
                DataRow dr = dt.NewRow();
                dr["IsSuccess"] = 0;
                dr["ResponseMSG"] = Altstr;
                dr["ResponseType"] = "error";
                dt.Rows.Add(dr);
                return JsonConvert.SerializeObject(dt);
            }
        }

        public static bool IsValid(string Password)
        {
            if (Password.Length < Minimum_Length)
                return false;
            if (UpperCaseCount(Password) < Upper_Case_length)
                return false;
            if (LowerCaseCount(Password) < Lower_Case_length)
                return false;
            if (NumericCount(Password) < 1)
                return false;
            if (NonAlphaCount(Password) < NonAlpha_length)
                return false;
            return true;
        }

        private static int UpperCaseCount(string Password)
        {
            return Regex.Matches(Password, "[A-Z]").Count;
        }
        private static int LowerCaseCount(string Password)
        {
            return Regex.Matches(Password, "[a-z]").Count;
        }
        private static int NumericCount(string Password)
        {
            return Regex.Matches(Password, "[0-9]").Count;
        }
        private static int NonAlphaCount(string Password)
        {
            return Regex.Matches(Password, @"[^0-9a-zA-Z\._]").Count;
        }

        [WebMethod(EnableSession = true)]
        public string ForgotPassword(string userid)
        {
            string _DeviceType = GetDeviceType();
            string IPaddress = GetIPAddress();
            string newpassword = RandomPassword.Generate(8, 10);
            string encryptedpassword = commanbll.EncryptPassword(newpassword.Trim());

            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.ForgotPassword(userid, encryptedpassword);
            if (myDataTable != null && myDataTable.Rows.Count > 0
                && Convert.ToString(myDataTable.Rows[0]["IsSuccess"]) == "1")
            {
                string reset_password_token = Convert.ToString(myDataTable.Rows[0]["reset_password_token"]);
                string name = Convert.ToString(myDataTable.Rows[0]["name"]);
                commanbll.sendForgotPasswordMail(userid, newpassword, reset_password_token, name);
            }
            return JsonConvert.SerializeObject(myDataTable);
        }

        public void SendForgotPasswordEmail(string emailid, string password, string reset_password_token, string name)
        {
            //SmtpClient SmtpMail = new SmtpClient("smtp.secureserver.net");
            //SmtpMail.Port = 587;
            //SmtpMail.EnableSsl = true;
            //SmtpMail.Timeout = 100000;
            //SmtpMail.DeliveryMethod = SmtpDeliveryMethod.Network;
            //SmtpMail.UseDefaultCredentials = false;
            //SmtpMail.Credentials = new NetworkCredential(
            //"support@whisperingshouts.com", "G7c#gh86");

            ////SmtpMail.Credentials = new NetworkCredential(
            ////System.Configuration.ConfigurationManager.AppSettings["Sender"].ToString(), System.Configuration.ConfigurationManager.AppSettings["Sender_pwd"].ToString());


            //string from = "support@whisperingshouts.com";

            //string Msg;
            //String Subject = "Forgot Password";


            string from = "support@whisperingshouts.com";
            string Msg;
            String Subject = "Forgot Password";
            String SMTPServer = "relay-hosting.secureserver.net";
            String SMTPPort = "25";
            SmtpClient SmtpMail = new SmtpClient(SMTPServer, Convert.ToInt32(SMTPPort));


            MailMessage MailMsg = new MailMessage();
            {
                {
                    //Msg = "<html><head></head>";
                    //Msg += "<body>";
                    //Msg += "<form id='form1' runat='server'>";
                    //Msg += "<div><table>";
                    //Msg += "<tr><td>Hi ,<br /><br /></td></tr>";
                    ////Msg += "<tr><td>your new password is: " + password.Trim() + " </td><tr>";
                    //// Msg += "<tr><td>your password is: " + password + " </td><tr>";
                    //Msg += "<tr><td style='height:30px'></td></tr>";

                    //Msg += "<tr><td style='height:30px'><a href='https://whisperingshouts.com/change-password/" + reset_password_token + "'>Reset Password</a></td></tr>";

                    //Msg += "<tr><td>Thank you,<br /></td></tr>";
                    //Msg += "<tr><td>Team <br />Whispering Shouts</td></tr>";
                    //Msg += "</table></div></form></body></html>";

                    Msg = "<html>";
                    Msg += "<body>";
                    Msg += "<p>Dear " + name + ",</p>";
                    Msg += "<p> You are receiving this mail because we received a request from your user id to generate a new password.Here is the link which you can use to generate your new password (https://whisperingshouts.com/change-password/" + reset_password_token + ").</p>";
                    Msg += "<p> If in &nbsp;case you did not request a new password then contact us immediately at info@whisperingshouts.com as someone maybe trying to get unauthorized access to your account.</p>";
                    Msg += "</body></html>";

                    try
                    {
                        MailMsg.IsBodyHtml = true;
                        MailMsg.Body = Msg;
                        MailMsg.To.Clear();
                        MailMsg.From = new MailAddress(from, "Whispering Shouts");
                        MailMsg.To.Add(new MailAddress(emailid));

                        MailMsg.Subject = Subject;
                        //SmtpMail.Host = SMTPServer;
                        SmtpMail.Send(MailMsg);
                    }
                    catch (Exception ex)
                    {
                        WriteError(ex.ToString());
                        //string str = ex.Message;
                        //Response.Write(str);
                    }
                }
            }
        }

        [WebMethod(EnableSession = true)]
        public string GetDashboardData()
        {
            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.GetDashboardData(Convert.ToString(Session["profileid"]));
            return JsonConvert.SerializeObject(myDataTable);
        }

        [WebMethod(EnableSession = true)]
        public string GetAdminDashboardData()
        {
            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.GetAdminDashboardData(Convert.ToString(Session["adminprofileid"]));
            return JsonConvert.SerializeObject(myDataTable);
        }

        [WebMethod(EnableSession = true)]
        public string GetTransactionData()
        {
            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.GetTransactionData(Convert.ToString(Session["profileid"]));
            return JsonConvert.SerializeObject(myDataTable);
        }

        [WebMethod(EnableSession = true)]
        public string GetReferAFriendData()
        {
            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.GetReferAFriendData(Convert.ToString(Session["profileid"]));
            return JsonConvert.SerializeObject(myDataTable);
        }

        [WebMethod(EnableSession = true)]
        public string WithdrawAmount(decimal points)
        {
            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.WithdrawAmount(Convert.ToString(Session["profileid"]), points);
            return JsonConvert.SerializeObject(myDataTable);
        }

        [WebMethod(EnableSession = true)]
        public string AddPartnerUserName(int PartnerID, string UserName)
        {
            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.AddPartnerUserName(Convert.ToString(Session["profileid"]), PartnerID, UserName);
            return JsonConvert.SerializeObject(myDataTable);
        }

        [WebMethod(EnableSession = true)]
        public string GetAllPartners(int partner_id)
        {
            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.GetAllPartners(Convert.ToString(Session["profileid"]), partner_id);
            return JsonConvert.SerializeObject(myDataTable);
        }

        [WebMethod(EnableSession = true)]
        public string GetBlog(int id, string request_type)
        {
            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.GetBlog(id, request_type);
            return JsonConvert.SerializeObject(myDataTable);
        }

        [WebMethod(EnableSession = true)]
        public string GetContests(int id, string request_type)
        {
            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.GetContests(id, request_type);
            return JsonConvert.SerializeObject(myDataTable);
        }

        [WebMethod(EnableSession = true)]
        public string GetContestsForUser(int contest_id)
        {
            string profileid = Convert.ToString(Session["profileid"]);
            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.GetContestsForUser(contest_id, profileid);
            return JsonConvert.SerializeObject(myDataTable);
        }

        [WebMethod(EnableSession = true)]
        public string SubmitAnswer(string DummyUserID, string QuestionID, string Answer, string entry_type
            , string person_id, int contest_id, string partner_user_name)
        {
            string user_id = Convert.ToString(Session["profileid"]);

            if (string.IsNullOrEmpty(user_id))
                user_id = person_id;

            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.SubmitAnswer(DummyUserID, QuestionID, Answer, entry_type, person_id, contest_id, partner_user_name);
            return JsonConvert.SerializeObject(myDataTable);
        }

        [WebMethod(EnableSession = true)]
        public string AddUpdateBlog(string type, string title, string description, string image_file_name
            , string social_tag_description, string short_description, string id)
        {
            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.AddUpdateBlog(type, title, description, image_file_name, social_tag_description
                , short_description, id);
            return JsonConvert.SerializeObject(myDataTable);
        }

        [WebMethod(EnableSession = true)]
        public string AddUpdateContests(string request_type, string name, string description, string tnc
           , int type, string start_date, string end_date, string image_file_name, string id)
        {
            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.AddUpdateContests(request_type, name, description, tnc, type
                , start_date, end_date, image_file_name, id);
            return JsonConvert.SerializeObject(myDataTable);
        }

        [WebMethod(EnableSession = true)]
        public string ContactUs(string name, string email, string subject, string message, string mobile)
        {
            string IPaddress = GetIPAddress();
            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.ContactUs(Convert.ToString(Session["profileid"]), name, email, subject, message, mobile, IPaddress);
            return JsonConvert.SerializeObject(myDataTable);
        }

        [WebMethod(EnableSession = true)]
        public string GetNotification(int id, string content, bool read, string notifiable_type, string request_type)
        {
            int notifiable_id = 0;
            notifiable_id = !string.IsNullOrEmpty(Convert.ToString(Session["profileid"])) ? Convert.ToInt32(Session["profileid"]) : 0;
            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.GetNotification(notifiable_id, id, content, read, notifiable_type, request_type);
            return JsonConvert.SerializeObject(myDataTable);
        }

        [WebMethod(EnableSession = true)]
        public string ReadNotification(int id, string content, bool read, string notifiable_type, string request_type)
        {
            int notifiable_id = 0;
            notifiable_id = !string.IsNullOrEmpty(Convert.ToString(Session["profileid"])) ? Convert.ToInt32(Session["profileid"]) : 0;
            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.ReadNotification(notifiable_id, id, content, read, notifiable_type, request_type);
            return JsonConvert.SerializeObject(myDataTable);
        }

        [WebMethod(EnableSession = true)]
        public string GetDeals(int deals_id)
        {
            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.GetDeals(Convert.ToString(Session["profileid"]), deals_id);
            return JsonConvert.SerializeObject(myDataTable);
        }

        [WebMethod(EnableSession = true)]
        public string GetPartnerUserName()
        {
            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.GetPartnerUserName(Convert.ToString(Session["profileid"]));
            return JsonConvert.SerializeObject(myDataTable);
        }

        [WebMethod(EnableSession = true)]
        public string UpdateProfile(string username, string mobileno
            , string filename, string pancard, string aadhaarcard, string bankname, string bankaccount
            , string bankifsc, string bankupi)
        {
            string _DeviceType = GetDeviceType();
            string IPaddress = GetIPAddress();
            string profileid = Convert.ToString(Session["profileid"]);

            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.UpdateProfile(username, mobileno, filename, pancard, aadhaarcard, bankname
                , bankaccount, bankifsc, bankupi, profileid);
            return JsonConvert.SerializeObject(myDataTable);
        }

        [WebMethod(EnableSession = true)]
        public string GetRewardsData()
        {
            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.GetRewardsData(Convert.ToString(Session["profileid"]));
            return JsonConvert.SerializeObject(myDataTable);
        }


        [WebMethod(EnableSession = true)]
        public string GetLeaderboard(int id, int rank, string type, string request_type)
        {
            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.GetLeaderboard(Convert.ToString(Session["profileid"]),
                id, rank, type, request_type
                );
            return JsonConvert.SerializeObject(myDataTable);
        }

        [WebMethod(EnableSession = true)]
        public string GetContestResult(int contest_id)
        {
            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.GetContestResult(Convert.ToString(Session["profileid"]), contest_id);
            return JsonConvert.SerializeObject(myDataTable);
        }

        [WebMethod(EnableSession = true)]
        public string GetHomePageData()
        {
            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.GetHomePageData(Convert.ToString(Session["profileid"]));
            return JsonConvert.SerializeObject(myDataTable);
        }

        [WebMethod(EnableSession = true)]
        public string Subscribe(string email_id)
        {
            string _DeviceType = GetDeviceType();
            string IPaddress = GetIPAddress();

            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.Subscribe(email_id, IPaddress);
            return JsonConvert.SerializeObject(myDataTable);
        }


        /// <summary>
        /// Admin 
        /// </summary>
        /// <param name="userid"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        [WebMethod(EnableSession = true)]
        public string AdminLogin(string userid, string password)
        {
            string returntype = string.Empty;
            try
            {
                if (userid == "admin@admin.com" && password == "admin@123")
                {
                    Session["adminprofileid"] = "1";
                    returntype = "success";
                }
                else if (userid == "richatiwari160@gmail.com" && password == "admin@123")
                {
                    Session["adminprofileid"] = "2";
                    returntype = "success";
                }
                else
                {
                    returntype = "fail";
                }
            }
            catch (Exception ex) { WriteError(ex.Message); }
            return returntype;
        }

        [WebMethod(EnableSession = true)]
        public string AdminCheckSession()
        {
            string returntype = string.Empty;
            try
            {
                string adminprofileid = Convert.ToString(Session["adminprofileid"]);
                if (adminprofileid == "1")
                {
                    returntype = "success";
                }
                else
                {
                    returntype = "fail";
                }
            }
            catch (Exception ex) { WriteError(ex.Message); }
            return returntype;
        }

        [WebMethod(EnableSession = true)]
        public string AdminCheckSessionForBlog()
        {
            string returntype = string.Empty;
            try
            {
                string adminprofileid = Convert.ToString(Session["adminprofileid"]);
                if (adminprofileid == "1" || adminprofileid == "2")
                {
                    returntype = "success";
                }
                else
                {
                    returntype = "fail";
                }
            }
            catch (Exception ex) { WriteError(ex.Message); }
            return returntype;
        }

        [WebMethod(EnableSession = true)]
        public string GetUpdatePartnerUserNameData(string type, string status, int id)
        {
            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.GetUpdatePartnerUserNameData(type, status, id);
            return JsonConvert.SerializeObject(myDataTable);
        }


        [WebMethod(EnableSession = true)]
        public string GetUpdateIdentities(string type, string status, string remarks, int id)
        {
            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.GetUpdateIdentities(type, status, remarks, id);
            return JsonConvert.SerializeObject(myDataTable);
        }

        [WebMethod(EnableSession = true)]
        public string GetUpdateKYCRequest(string type, string status, string remarks, int id)
        {
            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.GetUpdateKYCRequest(type, status, remarks, id);
            return JsonConvert.SerializeObject(myDataTable);
        }

        [WebMethod(EnableSession = true)]
        public string GetUpdateAnnouncements(string type, string status, string content, int id)
        {
            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.GetUpdateAnnouncements(type, status, content, id);
            return JsonConvert.SerializeObject(myDataTable);
        }

        [WebMethod(EnableSession = true)]
        public string GetUpdateWithdrawRequestData(string type, string status, int id)
        {
            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.GetUpdateWithdrawRequestData(type, status, id);
            return JsonConvert.SerializeObject(myDataTable);
        }

        [WebMethod(EnableSession = true)]
        public string GetUpdateRewardsData(string type, string reward_title, string reward_sub_title, string reward_image
            , string reward_value, string poker_room, string reward_code, string valid_till
            , string reward_description, int reward_id)
        {
            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.GetUpdateRewardsData(type, reward_title, reward_sub_title, reward_image, reward_value, poker_room
                , reward_code, valid_till, reward_description, reward_id);
            return JsonConvert.SerializeObject(myDataTable);
        }



        [WebMethod(EnableSession = true)]
        public string GetUpdateUsersData(string type, string status, int id)
        {
            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.GetUpdateUsersData(type, status, id);
            return JsonConvert.SerializeObject(myDataTable);
        }

        [WebMethod(EnableSession = true)]
        public string GetUpdatePartner(string type, int id)
        {
            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.GetUpdatePartner(type, id);
            return JsonConvert.SerializeObject(myDataTable);
        }


        [WebMethod(EnableSession = true)]
        public string GetPassbook()
        {
            string profileid = Convert.ToString(Session["profileid"]);
            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.GetPassbook(profileid == "" ? "0" : profileid);
            return JsonConvert.SerializeObject(myDataTable);
        }

        [WebMethod(EnableSession = true)]
        public string GetUpdateRakebackStats(int person_id, float amount, string description, string request_type)
        {
            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.GetUpdateRakebackStats(person_id, amount, description, request_type);
            return JsonConvert.SerializeObject(myDataTable);
        }
        [WebMethod(EnableSession = true)]
        public string generateOtp(string mobile, string otpType, string userType)
        {
            string userId = Convert.ToString(Session["profileid"]);

            DataSet myDataSet = new DataSet();
            myDataSet = commanbll.generateOtp(mobile, otpType, userType, userId, GetIPAddress(), GetDeviceType());
            return JsonConvert.SerializeObject(myDataSet);
        }

        [WebMethod(EnableSession = true)]
        public string verifyOtp(string mobile, string otp, string otpType, string userType)
        {
            string userId = Convert.ToString(Session["profileid"]);

            DataSet myDataSet = new DataSet();
            myDataSet = commanbll.verifyOtp(mobile, otp, otpType, userType, userId, GetIPAddress(), GetDeviceType());

            if (myDataSet != null && myDataSet.Tables.Count > 0 && myDataSet.Tables[0].Rows.Count > 0)
            {
                if (Convert.ToString(myDataSet.Tables[0].Rows[0]["success"]) == "1" && otpType.ToLower() == "login".ToLower())
                {
                    Session.Add("profileId", Convert.ToString(myDataSet.Tables[0].Rows[0]["profileId"]));
                    Session["UserID"] = Guid.NewGuid();
                }
            }

            return JsonConvert.SerializeObject(myDataSet);
        }
        [WebMethod(EnableSession = true)]
        public string verifyIFSC(string ifscCode)
        {
            DataSet myDataSet = new DataSet();
            myDataSet = commanbll.verifyIFSC(ifscCode);
            return JsonConvert.SerializeObject(myDataSet);
        }
        [WebMethod(EnableSession = true)]
        public string getBanner(int bannerId)
        {
            DataSet myDataSet = new DataSet();
            myDataSet = commanbll.getBanner(bannerId, "GET");
            return JsonConvert.SerializeObject(myDataSet);
        }
        [WebMethod(EnableSession = true)]
        public string rummySignUp(string name, string email, string mobile)
        {
            string _DeviceType = GetDeviceType();
            string IPaddress = GetIPAddress();

            DataTable myDataTable = new DataTable();
            myDataTable = commanbll.rummySignUp(name, email, mobile, IPaddress, _DeviceType);

            return JsonConvert.SerializeObject(myDataTable);
        }
        public class RSSFeed
        {
            public string Title { get; set; }
            public string Link { get; set; }
            public string Description { get; set; }
            public string PubDate { get; set; }
        }
        public class RSSFeedDetails
        {
            public string Article { get; set; }
        }
        [WebMethod(EnableSession = true)]
        public string GetFeed(string url)
        {
            string ResponseString = string.Empty;

            WebClient wclient = new WebClient();
            string RSSData = wclient.DownloadString(url);

            XDocument xml = XDocument.Parse(RSSData);
            var RSSFeedData = (from x in xml.Descendants("item")
                               select new RSSFeed
                               {
                                   Title = ((string)x.Element("title")),
                                   Link = ((string)x.Element("link")),
                                   Description = ((string)x.Element("description")),
                                   PubDate = ((string)x.Element("pubDate"))
                               });
            return JsonConvert.SerializeObject(RSSFeedData);

            //try
            //{
            //    Stream dataStream = null;
            //    HttpWebRequest request = null;
            //    HttpWebResponse response = null;
            //    StreamReader reader = null;

            //    request = (HttpWebRequest)WebRequest.Create(url);

            //    request.Timeout = 1000 * 1000;
            //    request.Proxy = null;
            //    response = (HttpWebResponse)request.GetResponse();
            //    dataStream = response.GetResponseStream();
            //    reader = new StreamReader(dataStream);
            //    ResponseString = reader.ReadLine();

            //}
            //catch (WebException ex)
            //{
            //    if (ex.Status == WebExceptionStatus.ProtocolError)
            //    {
            //        HttpWebResponse err = ex.Response as HttpWebResponse;
            //        if (err != null)
            //        {
            //            ResponseString = new StreamReader(err.GetResponseStream()).ReadToEnd();
            //        }
            //    }
            //}

        }

        [WebMethod(EnableSession = true)]
        public string GetFeedDetails(string url)
        {
            string ResponseString = string.Empty;

            WebClient wclient = new WebClient();
            string RSSData = wclient.DownloadString(url);

            XDocument xml = XDocument.Parse(RSSData);
            var RSSFeedData = (from x in xml.Descendants("div")
                               select new RSSFeedDetails
                               {
                                   Article = ((string)x.Element("article")),
                               });
            return JsonConvert.SerializeObject(RSSFeedData);

        }
        [WebMethod(EnableSession = true)]
        public string Logout()
        {
            Session.Abandon();
            return "success";
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
                        w.WriteLine("{0}", DateTime.Now.ToString(CultureInfo.InvariantCulture));
                        string err = "Error in: " + HttpContext.Current.Request.Url.ToString() +
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

        private string GetDeviceType()
        {
            string _DeviceType = "Web";

            try
            {
                string u = HttpContext.Current.Request.ServerVariables["HTTP_USER_AGENT"];
                Regex b = new Regex(@"(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino", RegexOptions.IgnoreCase | RegexOptions.Multiline);
                Regex v = new Regex(@"1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-", RegexOptions.IgnoreCase | RegexOptions.Multiline);
                if ((b.IsMatch(u) || v.IsMatch(u.Substring(0, 4))))
                {
                    _DeviceType = "Mobile";
                }

            }
            catch (Exception ex)
            {
                _DeviceType = "Web";
            }
            return _DeviceType;
        }

        public class ReponseMessageDetails
        {
            public int IsError { get; set; }
            public string Message { get; set; }
            public string errortype { get; set; }

            public int IsSuccess { get; set; }
            public string Program { get; set; }
            public int LastQuestionScore { get; set; }

        }
    }
}
