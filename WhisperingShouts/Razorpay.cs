using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;

namespace WhisperingShouts
{
    public class Razorpay
    {
        //public string CreateContact()
        //{
        //    int statusCd = 0;

        //    string responseValue = string.Empty;

        //    try
        //    {
        //        var requestUri = "https://api.razorpay.com/v1/contacts";
        //        WebRequest webRequest = WebRequest.Create(requestUri);
        //        webRequest.Method = "POST";
        //        webRequest.Headers.Add(string.Format("Authorization: key={0}", "Basic cnpwX3Rlc3RfTzF6aThLMmgwWXFKMko6WXIxTkw4VTgzTFY2eFMwWktjamhyNGxq"));
        //        webRequest.ContentType = "application/json";

        //        //var serializer = new System.Web.Script.Serialization.JavaScriptSerializer();
        //        //var json = serializer.Serialize(_obj);

        //        var json = @"{
        //      ""name"": ""Girish Kumar"",
        //      ""email"": ""girishkumar486@gmail.com"",
        //      ""contact"": 8287640487,
        //      ""type"": ""employee"",
        //      ""reference_id"": ""Acme Contact ID 12345"",
        //      ""notes"":{
        //                    ""random_key_1"": ""Make it so."",
        //        ""random_key_2"": ""Tea. Earl Grey. Hot.""
        //      }
        //}";

        //        Byte[] byteArray = Encoding.UTF8.GetBytes(json);
        //        webRequest.ContentLength = byteArray.Length;
        //        using (Stream dataStream = webRequest.GetRequestStream())
        //        {
        //            dataStream.Write(byteArray, 0, byteArray.Length);
        //            using (WebResponse webResponse = webRequest.GetResponse())
        //            {
        //                using (Stream dataStreamResponse = webResponse.GetResponseStream())
        //                {
        //                    using (StreamReader tReader = new StreamReader(dataStreamResponse))
        //                    {
        //                        String sResponseFromServer = tReader.ReadToEnd();
        //                        responseValue = sResponseFromServer;
        //                    }
        //                }
        //            }
        //        }

        //    }
        //    catch (WebException ex)
        //    {
        //        if (ex.Status == WebExceptionStatus.ProtocolError)
        //        {
        //            HttpWebResponse err = ex.Response as HttpWebResponse;
        //            if (err != null)
        //            {
        //                string ResponseString = "";
        //                ResponseString = new StreamReader(err.GetResponseStream()).ReadToEnd();
        //                ResponseString = ResponseString.TrimStart('[');
        //                ResponseString = ResponseString.TrimEnd(']');

        //            }

        //        }
        //        //string exce = new StreamReader(ex.Response.GetResponseStream().Read().ToString());
        //        int ErrIndx = 0;
        //        ErrIndx = ex.Message.IndexOf("The remote server returned an error: (404) Not Found");
        //        if (ErrIndx >= 0)
        //        {
        //            //fnUpdateLogText("HTTPS Resposne Received - " + ex.Message);
        //            //fnUpdateLogText("No Payments found for the reference number provided !!!");
        //        }
        //        else
        //        {
        //            var reader2 = new StreamReader(ex.Response.GetResponseStream());
        //            Console.WriteLine(reader2.ReadToEnd());
        //            responseValue = ex.Message;
        //            //fnUpdateLogText(responseValue);
        //            //fnUpdateLogText("Unable to connect to API Endpoint!!!");
        //        }
        //    }
        //    return responseValue;

        //    //    //TO BE CONFIGURED
        //    //    string EndPoint = "https://api.razorpay.com/v1/contacts";
        //    //    //WebConfigurationManager.AppSettings["ConsumeEndpoint"].ToString();

        //    //    var request = (HttpWebRequest)WebRequest.Create(EndPoint);

        //    //    //if (txtP12Password.Text != "")
        //    //    //    Certpassword = txtP12Password.Text;
        //    //    //X509Certificate2 cert = new X509Certificate2(certPath, Certpassword, X509KeyStorageFlags.MachineKeySet | X509KeyStorageFlags.Exportable);
        //    //    //request.ClientCertificates.Add(cert);

        //    //    var _json = @"{
        //    //      ""name"": ""Girish Kumar"",
        //    //      ""email"": ""girishkumar486@gmail.com"",
        //    //      ""contact"": 8287640487,
        //    //      ""type"": ""employee"",
        //    //      ""reference_id"": ""Acme Contact ID 12345"",
        //    //      ""notes"":{
        //    //                    ""random_key_1"": ""Make it so."",
        //    //        ""random_key_2"": ""Tea. Earl Grey. Hot.""
        //    //      }
        //    //}";


        //    //    var encoding = new UTF8Encoding();
        //    //    var byteArray = Encoding.GetEncoding("iso-8859-1").GetBytes(_json);

        //    //    //BELOW POST Method will be used for Consume API Endpoint
        //    //    request.Method = "POST";
        //    //    request.ContentType = "application/json";
        //    //    request.ContentLength = byteArray.Length;
        //    //    //request.PreAuthenticate = true;
        //    //    request.Headers.Add("Authorization", "Basic cnpwX3Rlc3RfTzF6aThLMmgwWXFKMko6WXIxTkw4VTgzTFY2eFMwWktjamhyNGxq");

        //    //    //===========Added Proxy
        //    //    //if (txtProxy.Text != "" && txtPort.Text != "")
        //    //    //{
        //    //    //    string MyProxyHostString = txtProxy.Text;
        //    //    //    int MyProxyPort = Convert.ToInt32(txtPort.Text);
        //    //    //    request.Proxy = new WebProxy(MyProxyHostString, MyProxyPort);
        //    //    //}
        //    //    using (var writeStream = request.GetRequestStream())
        //    //    {
        //    //        writeStream.Write(byteArray, 0, byteArray.Length);
        //    //    }
        //    //    //fnUpdateLogText("Waiting for HTTPS Response...");
        //    //    try
        //    //    {
        //    //        using (HttpWebResponse response = request.GetResponse() as HttpWebResponse)
        //    //        {
        //    //            statusCd = (int)response.StatusCode;
        //    //            if (response.StatusCode != HttpStatusCode.OK)
        //    //            {
        //    //                var message = String.Format("Request failed. Received HTTP {0}", response.StatusCode);
        //    //                throw new ApplicationException(message);
        //    //                //fnUpdateLogText(String.Format("Request failed. Received HTTP {0}", response.StatusCode));
        //    //            }

        //    //            // grab the response
        //    //            using (var responseStream = response.GetResponseStream())
        //    //            {
        //    //                if (responseStream != null)
        //    //                    using (var reader1 = new StreamReader(responseStream))
        //    //                    {
        //    //                        responseValue = reader1.ReadToEnd();
        //    //                        //fnUpdateLogText("HttpStatusCode.OK Received...");
        //    //                        //fnUpdateLogText("Connected to API Endpoint...");
        //    //                        //fnUpdateLogText("Started Decrypting API response...");
        //    //                        //DecryptStr(responseValue);
        //    //                    }
        //    //            }
        //    //        }
        //    //    }
        //    //    catch (WebException ex)
        //    //    {
        //    //        if (ex.Status == WebExceptionStatus.ProtocolError)
        //    //        {
        //    //            HttpWebResponse err = ex.Response as HttpWebResponse;
        //    //            if (err != null)
        //    //            {
        //    //                string ResponseString = "";
        //    //                ResponseString = new StreamReader(err.GetResponseStream()).ReadToEnd();
        //    //                ResponseString = ResponseString.TrimStart('[');
        //    //                ResponseString = ResponseString.TrimEnd(']');

        //    //            }

        //    //        }
        //    //        //string exce = new StreamReader(ex.Response.GetResponseStream().Read().ToString());
        //    //        int ErrIndx = 0;
        //    //        ErrIndx = ex.Message.IndexOf("The remote server returned an error: (404) Not Found");
        //    //        if (ErrIndx >= 0)
        //    //        {
        //    //            //fnUpdateLogText("HTTPS Resposne Received - " + ex.Message);
        //    //            //fnUpdateLogText("No Payments found for the reference number provided !!!");
        //    //        }
        //    //        else
        //    //        {
        //    //            var reader2 = new StreamReader(ex.Response.GetResponseStream());
        //    //            Console.WriteLine(reader2.ReadToEnd());
        //    //            responseValue = ex.Message;
        //    //            //fnUpdateLogText(responseValue);
        //    //            //fnUpdateLogText("Unable to connect to API Endpoint!!!");
        //    //        }
        //    //    }
        //    //    //objApIresp.jsonResponse = responseValue;
        //    //    //objApIresp.statusCode = statusCd;
        //    //    //return objApIresp;

        //    //    return responseValue;
        //}
    }
}