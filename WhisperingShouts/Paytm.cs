using Newtonsoft.Json;
using Paytm;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;

namespace WhisperingShouts
{
    public class Paytm
    {
        public void GetAccountDetails()
        {
            try
            {
                Dictionary<string, string> requestBody = new Dictionary<string, string>();

                string post_data = JsonConvert.SerializeObject(requestBody);

                /*
                * Generate checksum by parameters we have in body
                * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
                */
                
                string paytmChecksum = Checksum.generateSignature(JsonConvert.SerializeObject(requestBody), "HxRIq7EjAQkUb6Jv");

                string x_mid = "Whispe24766571401592";// "YOUR_MID_HERE";
                string x_checksum = paytmChecksum;

                //For  Staging
                string url = "https://staging-dashboard.paytm.com/bpay/api/v1/account/list";

                //For  Production 
                //string  url  =  "https://dashboard.paytm.com/bpay/api/v1/account/list";

                HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(url);

                webRequest.Method = "POST";
                webRequest.ContentType = "application/json";
                webRequest.ContentLength = post_data.Length;
                webRequest.Headers.Add("x-mid", x_mid);
                webRequest.Headers.Add("x-checksum", x_checksum);
                using (StreamWriter requestWriter = new StreamWriter(webRequest.GetRequestStream()))
                {
                    requestWriter.Write(post_data);
                }

                string responseData = string.Empty;

                using (StreamReader responseReader = new StreamReader(webRequest.GetResponse().GetResponseStream()))
                {
                    responseData = responseReader.ReadToEnd();
                    Console.WriteLine(responseData);
                }
            }
            catch (WebException ex)
            {
                if (ex.Status == WebExceptionStatus.ProtocolError)
                {
                    HttpWebResponse err = ex.Response as HttpWebResponse;
                    if (err != null)
                    {
                        string ResponseString = "";
                        ResponseString = new StreamReader(err.GetResponseStream()).ReadToEnd();
                        ResponseString = ResponseString.TrimStart('[');
                        ResponseString = ResponseString.TrimEnd(']');

                    }

                }
                //string exce = new StreamReader(ex.Response.GetResponseStream().Read().ToString());
                int ErrIndx = 0;
                ErrIndx = ex.Message.IndexOf("The remote server returned an error: (404) Not Found");
                if (ErrIndx >= 0)
                {
                    //fnUpdateLogText("HTTPS Resposne Received - " + ex.Message);
                    //fnUpdateLogText("No Payments found for the reference number provided !!!");
                }
                else
                {
                    var reader2 = new StreamReader(ex.Response.GetResponseStream());
                    Console.WriteLine(reader2.ReadToEnd());
                    //responseValue = ex.Message;
                    //fnUpdateLogText(responseValue);
                    //fnUpdateLogText("Unable to connect to API Endpoint!!!");
                }
            }
        }
        public void BankTransfer()
        {
            try
            {
                Dictionary<string, string> requestBody = new Dictionary<string, string>();

                //requestBody.Add("subwalletGuid", "60958e54-6f74-11eb-90f5-fa163e429e83");
                //requestBody.Add("orderId", "ORDERID_240220211");
                //requestBody.Add("beneficiaryAccount", "918008484891");
                //requestBody.Add("beneficiaryIFSC", "PYTM0123456");
                //requestBody.Add("amount", "1.00");
                //requestBody.Add("purpose", "SALARY_DISBURSEMENT");
                //requestBody.Add("transferMode", "UPI");
                //requestBody.Add("date", "2021-02-23");


                requestBody.Add("subwalletGuid", "60958e54-6f74-11eb-90f5-fa163e429e83");
                requestBody.Add("orderId", "ORDERID_240220211");
                requestBody.Add("beneficiaryVPA", "test@paytm");
                requestBody.Add("amount", "1.00");
                requestBody.Add("purpose", "SALARY_DISBURSEMENT");
                requestBody.Add("transferMode", "UPI");
                requestBody.Add("date", "2021-02-23");

                string post_data = JsonConvert.SerializeObject(requestBody);

                /*
                * Generate checksum by parameters we have in body
                * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
                */
                string paytmChecksum = Checksum.generateSignature(JsonConvert.SerializeObject(requestBody), "HxRIq7EjAQkUb6Jv");

                string x_mid = "Whispe24766571401592";// "YOUR_MID_HERE";
                string x_checksum = paytmChecksum;

                //For  Staging
                string url = "https://staging-dashboard.paytm.com/bpay/api/v1/disburse/order/bank";

                //For  Production 
                //string  url  =  "https://dashboard.paytm.com/bpay/api/v1/disburse/order/bank";

                HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(url);

                webRequest.Method = "POST";
                webRequest.ContentType = "application/json";
                webRequest.ContentLength = post_data.Length;
                webRequest.Headers.Add("x-mid", x_mid);
                webRequest.Headers.Add("x-checksum", x_checksum);
                using (StreamWriter requestWriter = new StreamWriter(webRequest.GetRequestStream()))
                {
                    requestWriter.Write(post_data);
                }

                string responseData = string.Empty;

                using (StreamReader responseReader = new StreamReader(webRequest.GetResponse().GetResponseStream()))
                {
                    responseData = responseReader.ReadToEnd();
                    Console.WriteLine(responseData);
                }
            }
            catch (WebException ex)
            {
                if (ex.Status == WebExceptionStatus.ProtocolError)
                {
                    HttpWebResponse err = ex.Response as HttpWebResponse;
                    if (err != null)
                    {
                        string ResponseString = "";
                        ResponseString = new StreamReader(err.GetResponseStream()).ReadToEnd();
                        ResponseString = ResponseString.TrimStart('[');
                        ResponseString = ResponseString.TrimEnd(']');

                    }

                }
                //string exce = new StreamReader(ex.Response.GetResponseStream().Read().ToString());
                int ErrIndx = 0;
                ErrIndx = ex.Message.IndexOf("The remote server returned an error: (404) Not Found");
                if (ErrIndx >= 0)
                {
                    //fnUpdateLogText("HTTPS Resposne Received - " + ex.Message);
                    //fnUpdateLogText("No Payments found for the reference number provided !!!");
                }
                else
                {
                    var reader2 = new StreamReader(ex.Response.GetResponseStream());
                    Console.WriteLine(reader2.ReadToEnd());
                    //responseValue = ex.Message;
                    //fnUpdateLogText(responseValue);
                    //fnUpdateLogText("Unable to connect to API Endpoint!!!");
                }
            }
        }
        public void BankAccountValidation()
        {
            try
            {
                Dictionary<string, string> requestBody = new Dictionary<string, string>();

                requestBody.Add("orderId", "ORDERID_98765");
                requestBody.Add("subwalletGuid", "60958e54-6f74-11eb-90f5-fa163e429e83");
                requestBody.Add("beneficiaryAccount", "02481050072691");
                requestBody.Add("beneficiaryIFSC", "HDFC0000248");


                string post_data = JsonConvert.SerializeObject(requestBody);

                /*
                * Generate checksum by parameters we have in body
                * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
                */
                string paytmChecksum = Checksum.generateSignature(JsonConvert.SerializeObject(requestBody), "HxRIq7EjAQkUb6Jv");

                string x_mid = "Whispe24766571401592";// "YOUR_MID_HERE";
                string x_checksum = paytmChecksum;

                //For  Staging
                string url = "https://staging-dashboard.paytm.com/bpay/api/v1/beneficiary/validate";

                //For  Production 
                //string  url  =  "https://dashboard.paytm.com/bpay/api/v1/beneficiary/validate";

                HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(url);

                webRequest.Method = "POST";
                webRequest.ContentType = "application/json";
                webRequest.ContentLength = post_data.Length;
                webRequest.Headers.Add("x-mid", x_mid);
                webRequest.Headers.Add("x-checksum", x_checksum);
                using (StreamWriter requestWriter = new StreamWriter(webRequest.GetRequestStream()))
                {
                    requestWriter.Write(post_data);
                }

                string responseData = string.Empty;

                using (StreamReader responseReader = new StreamReader(webRequest.GetResponse().GetResponseStream()))
                {
                    responseData = responseReader.ReadToEnd();
                    Console.WriteLine(responseData);
                }
            }
            catch (WebException ex)
            {
                if (ex.Status == WebExceptionStatus.ProtocolError)
                {
                    HttpWebResponse err = ex.Response as HttpWebResponse;
                    if (err != null)
                    {
                        string ResponseString = "";
                        ResponseString = new StreamReader(err.GetResponseStream()).ReadToEnd();
                        ResponseString = ResponseString.TrimStart('[');
                        ResponseString = ResponseString.TrimEnd(']');

                    }

                }
                //string exce = new StreamReader(ex.Response.GetResponseStream().Read().ToString());
                int ErrIndx = 0;
                ErrIndx = ex.Message.IndexOf("The remote server returned an error: (404) Not Found");
                if (ErrIndx >= 0)
                {
                    //fnUpdateLogText("HTTPS Resposne Received - " + ex.Message);
                    //fnUpdateLogText("No Payments found for the reference number provided !!!");
                }
                else
                {
                    var reader2 = new StreamReader(ex.Response.GetResponseStream());
                    Console.WriteLine(reader2.ReadToEnd());
                    //responseValue = ex.Message;
                    //fnUpdateLogText(responseValue);
                    //fnUpdateLogText("Unable to connect to API Endpoint!!!");
                }
            }
        }
        public void DisburseStatus()
        {
            try
            {
                Dictionary<string, string> requestBody = new Dictionary<string, string>();

                requestBody.Add("orderId", "ORDERID_240220211");


                string post_data = JsonConvert.SerializeObject(requestBody);

                /*
                * Generate checksum by parameters we have in body
                * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
                */
                string paytmChecksum = Checksum.generateSignature(JsonConvert.SerializeObject(requestBody), "HxRIq7EjAQkUb6Jv");

                string x_mid = "Whispe24766571401592";// "YOUR_MID_HERE";
                string x_checksum = paytmChecksum;

                //For  Staging
                string url = "https://staging-dashboard.paytm.com/bpay/api/v1/disburse/order/query";

                //For  Production 
                //string  url  =  "https://dashboard.paytm.com/bpay/api/v1/disburse/order/query";

                HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(url);

                webRequest.Method = "POST";
                webRequest.ContentType = "application/json";
                webRequest.ContentLength = post_data.Length;
                webRequest.Headers.Add("x-mid", x_mid);
                webRequest.Headers.Add("x-checksum", x_checksum);
                using (StreamWriter requestWriter = new StreamWriter(webRequest.GetRequestStream()))
                {
                    requestWriter.Write(post_data);
                }

                string responseData = string.Empty;

                using (StreamReader responseReader = new StreamReader(webRequest.GetResponse().GetResponseStream()))
                {
                    responseData = responseReader.ReadToEnd();
                    Console.WriteLine(responseData);
                }


            }
            catch (WebException ex)
            {
                if (ex.Status == WebExceptionStatus.ProtocolError)
                {
                    HttpWebResponse err = ex.Response as HttpWebResponse;
                    if (err != null)
                    {
                        string ResponseString = "";
                        ResponseString = new StreamReader(err.GetResponseStream()).ReadToEnd();
                        ResponseString = ResponseString.TrimStart('[');
                        ResponseString = ResponseString.TrimEnd(']');

                    }

                }
                //string exce = new StreamReader(ex.Response.GetResponseStream().Read().ToString());
                int ErrIndx = 0;
                ErrIndx = ex.Message.IndexOf("The remote server returned an error: (404) Not Found");
                if (ErrIndx >= 0)
                {
                    //fnUpdateLogText("HTTPS Resposne Received - " + ex.Message);
                    //fnUpdateLogText("No Payments found for the reference number provided !!!");
                }
                else
                {
                    var reader2 = new StreamReader(ex.Response.GetResponseStream());
                    Console.WriteLine(reader2.ReadToEnd());
                    //responseValue = ex.Message;
                    //fnUpdateLogText(responseValue);
                    //fnUpdateLogText("Unable to connect to API Endpoint!!!");
                }
            }
        }
    }
}