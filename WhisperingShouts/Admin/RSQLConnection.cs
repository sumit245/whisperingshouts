using System;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;

namespace WhisperingShouts.Admin
{
    public class RSQLConnection
    {

        //============================================================
        //***** protected and private variables ********
        //============================================================

        const bool DEBUG = false;
        const string DB_TIMEOUT = "400";
        const string DB_MINPOOL = "10";
        const string DB_MAXPOOL = "100";
        //const string DB_SERVER = "10.112.2.7";
        //const string DB_USER = "sa";
        //const string DB_PASS = "Passw0rd";
        //const string DB_DATABASE = "MarutiAutoCard"; 


        private string CString_;
        private string LastError_;
        private bool isRollback_;
        private bool isConnected_;
        private string Query_;
        private string Table_;

        private SqlConnection Connection_;
        private SqlTransaction DatabaseTransaction_;

        //################################################
        //Default Constructor
        public RSQLConnection()
        {
            Reset();
        }

        //################################################
        //Connect to Database
        public void Connect()
        {
            try
            {
                // CString_ = "Data Source=" + DB_SERVER + ";Database=" + DB_DATABASE + ";User ID=" + DB_USER + ";Password=" + DB_PASS +";Connection Timeout=" + DB_TIMEOUT + ";Min Pool Size=" + DB_MINPOOL + ";Max Pool Size=" + DB_MAXPOOL + ";Pooling =True;Persist Security Info=True";

                //CString_ = "Initial Catalog=anmolratna;Data Source=localhost;Integrated Security=SSPI;Connect Timeout=20000;pooling=true;max pool size=500;";

                CString_ = "Data Source=148.72.232.167;Database=Rakeback;User ID=rakeback;Password=G7c#gh86;";
                //Data Source = tcp:whisperingshoutsdbserver.database.windows.net,1433; Initial Catalog = WhisperingShouts_db; User Id = @whisperingshoutsdbserver; Password =Pu$hpam143"
                         //CString_ = "Data Source=" + System.Configuration.ConfigurationManager.AppSettings["dbServer"].ToString() + ";Database=" + System.Configuration.ConfigurationManager.AppSettings["DBName"].ToString() + ";User ID=" + System.Configuration.ConfigurationManager.AppSettings["DBuser"].ToString() + ";Password=" + System.Configuration.ConfigurationManager.AppSettings["Pwd"].ToString() + ";Connection Timeout=" + DB_TIMEOUT + ";Min Pool Size=" + DB_MINPOOL + ";Max Pool Size=" + DB_MAXPOOL + ";Pooling =True;Persist Security Info=True";

                         isConnected_ = true;

                Connection_ = new SqlConnection();
                Connection_.ConnectionString = CString_;
                Connection_.Open();
                Execute("SET ANSI_NULLS ON; SET QUOTED_IDENTIFIER ON ; SET ANSI_PADDING ON; SET ARITHABORT ON");
            }
            catch (Exception e)
            {
                LastError_ = "Error in connection:- " + e.Message + System.Environment.NewLine;
                isConnected_ = false;
            }
        }

        //######################################################## 
        //# Executes a SQL statement and return DataReader
        public SqlDataReader getReader(String Script)
        {
            SqlCommand cmdQuery = null;
            SqlDataReader readr = null;
            LastError_ = "";

            if (Script.Length > 0 && IsOpen())
            {
                try
                {
                    cmdQuery = new SqlCommand();
                    cmdQuery.CommandTimeout = 90;
                    cmdQuery.CommandText = Script;
                    if (IsBegin()) cmdQuery.Transaction = DatabaseTransaction_;
                    cmdQuery.Connection = Connection_;
                    readr = cmdQuery.ExecuteReader();
                }
                catch (Exception e) { LastError_ = e.Message + System.Environment.NewLine; }
            }
            return readr;
        }

        //######################################################## 
        //# Executes a SQL statement and return DataAdapter
        public SqlDataAdapter getAdapter(String Script)
        {
            SqlCommand cmdQuery = null;
            SqlDataAdapter Adpt = null;
            LastError_ = "";

            if (Script.Length > 0 && IsOpen())
            {
                try
                {
                    cmdQuery = new SqlCommand();
                    cmdQuery.CommandTimeout = 90;
                    cmdQuery.CommandText = Script;
                    if (IsBegin()) cmdQuery.Transaction = DatabaseTransaction_;
                    cmdQuery.Connection = Connection_;
                    Adpt = new SqlDataAdapter(cmdQuery);
                }
                catch (Exception e) { LastError_ = e.Message + System.Environment.NewLine; }
            }
            return Adpt;
        }

        //######################################################## 
        //# Executes a SQL statement and return DataSet
        public DataSet getDataSet(String Script, String table)
        {
            SqlCommand cmdQuery = null;
            SqlDataAdapter Adpt = null;
            DataSet ds = null;
            LastError_ = "";

            if (Script.Length > 0 && IsOpen())
            {
                try
                {
                    cmdQuery = new SqlCommand();
                    cmdQuery.CommandTimeout = 90;
                    cmdQuery.CommandText = Script;
                    if (IsBegin()) cmdQuery.Transaction = DatabaseTransaction_;
                    cmdQuery.Connection = Connection_;
                    Adpt = new SqlDataAdapter(cmdQuery);
                    ds = new DataSet();
                    Adpt.Fill(ds, table);
                    Adpt.Dispose();
                }
                catch (Exception e) { LastError_ = e.Message + System.Environment.NewLine; }
            }
            return ds;
        }

        //######################################################## 
        //# Executes a SQL statement and fill DataSet
        public void createDataSet(String Script, String table, ref DataSet ds)
        {
            SqlCommand cmdQuery = null;
            SqlDataAdapter Adpt = null;
            LastError_ = "";

            if (Script.Length > 0 && IsOpen())
            {
                try
                {
                    cmdQuery = new SqlCommand();
                    cmdQuery.CommandTimeout = 90;
                    cmdQuery.CommandText = Script;
                    if (IsBegin()) cmdQuery.Transaction = DatabaseTransaction_;
                    cmdQuery.Connection = Connection_;
                    Adpt = new SqlDataAdapter(cmdQuery);

                    if (ds == null) ds = new DataSet();
                    Adpt.Fill(ds, table);
                    Adpt.Dispose();
                }
                catch (Exception e) { LastError_ = e.Message + System.Environment.NewLine; }
            }
        }

        //######################################################## 
        //# Executes a SQL statement and fill DataSet
        public void createDataSet(ref DataSet ds)
        {
            SqlCommand cmdQuery = null;
            SqlDataAdapter Adpt = null;
            LastError_ = "";

            if (Query_.Length > 0 && IsOpen())
            {
                try
                {
                    cmdQuery = new SqlCommand();
                    cmdQuery.CommandTimeout = 90;
                    cmdQuery.CommandText = Query_;
                    if (IsBegin()) cmdQuery.Transaction = DatabaseTransaction_;
                    cmdQuery.Connection = Connection_;
                    Adpt = new SqlDataAdapter(cmdQuery);

                    if (ds == null) ds = new DataSet();
                    Adpt.Fill(ds, Table_);
                    Adpt.Dispose();
                }
                catch (Exception e) { LastError_ = e.Message + System.Environment.NewLine; }
            }
        }

        //######################################################## 
        //# executes a Non Selecte SQL statement
        public int Execute(String Script)
        {
            SqlCommand cmdQuery;
            LastError_ = "";
            int AffectedRec = 0;

            if (Script.Length > 0 && IsOpen())
            {
                try
                {
                    cmdQuery = new SqlCommand();
                    cmdQuery.CommandTimeout = 90;
                    cmdQuery.CommandText = Script;
                    if (IsBegin()) cmdQuery.Transaction = DatabaseTransaction_;
                    cmdQuery.Connection = Connection_;
                    AffectedRec = cmdQuery.ExecuteNonQuery();
                }
                catch (Exception e) { LastError_ = e.Message + System.Environment.NewLine; }
            }
            return AffectedRec;
        }

        //#################################################
        //#Create a SQL Command Parameter        
        public SqlParameter CreateParameterProfile(string Name, SqlDbType Type, Object Value)
        {
            SqlParameter Param = null;
            if (Value.ToString().Trim().Length == 0) { Value = DBNull.Value; }
            try
            {
                Param = new SqlParameter();
                Param.ParameterName = Name;
                Param.SqlDbType = Type;
                Param.Value = Value;
            }
            catch (Exception e) { LastError_ = e.Message + System.Environment.NewLine; }
            return Param;
        }

        //#################################################
        //#Create a SQL Command Parameter        
        public SqlParameter CreateParameterProfile(string Name, SqlDbType Type, int Size, Object Value)
        {
            SqlParameter Param = null;
            if (Value.ToString().Trim().Length == 0) { Value = DBNull.Value; }
            try
            {
                Param = new SqlParameter();
                Param.ParameterName = Name;
                Param.SqlDbType = Type;
                Param.Size = Size;
                Param.Value = Value;
            }
            catch (Exception e) { LastError_ = e.Message + System.Environment.NewLine; }
            return Param;
        }

        //#################################################
        //#Create a SQL Command Parameter        
        public SqlParameter CreateParameterProfile(string Name, SqlDbType Type, ParameterDirection Direction)
        {
            SqlParameter Param = null;
            try
            {
                Param = new SqlParameter();
                Param.ParameterName = Name;
                Param.SqlDbType = Type;
                Param.Direction = Direction;
            }
            catch (Exception e) { LastError_ = e.Message + System.Environment.NewLine; }
            return Param;
        }

        //#################################################
        //#Create a SQL Command Parameter
        public SqlParameter CreateParameter(string Name, Object Value)
        {
            SqlParameter Param = null;
            try
            {
                Param = new SqlParameter();
                Param.ParameterName = Name;
                Param.Value = Value;
            }
            catch (Exception e) { LastError_ = e.Message + System.Environment.NewLine; }
            return Param;
        }

        //#################################################
        //#Create a SQL Command Parameter        
        public SqlParameter CreateParameter(string Name, SqlDbType Type, Object Value)
        {
            SqlParameter Param = null;
            try
            {
                Param = new SqlParameter();
                Param.ParameterName = Name;
                Param.SqlDbType = Type;
                Param.Value = Value;
            }
            catch (Exception e) { LastError_ = e.Message + System.Environment.NewLine; }
            return Param;
        }

        //#################################################
        //#Create a SQL Command Parameter        
        public SqlParameter CreateParameter(string Name, SqlDbType Type, int Size, Object Value)
        {
            SqlParameter Param = null;
            try
            {
                Param = new SqlParameter();
                Param.ParameterName = Name;
                Param.SqlDbType = Type;
                Param.Size = Size;
                Param.Value = Value;
            }
            catch (Exception e) { LastError_ = e.Message + System.Environment.NewLine; }
            return Param;
        }

        //#################################################
        //#Create a SQL Command Parameter        
        public SqlParameter CreateParameter(string Name, SqlDbType Type, ParameterDirection Direction)
        {
            SqlParameter Param = null;
            try
            {
                Param = new SqlParameter();
                Param.ParameterName = Name;
                Param.SqlDbType = Type;
                Param.Direction = Direction;
            }
            catch (Exception e) { LastError_ = e.Message + System.Environment.NewLine; }
            return Param;
        }

        //#################################################
        //#Create a SQL Command Parameter        
        public SqlParameter CreateParameter(string Name, SqlDbType Type, ParameterDirection Direction, Object Value)
        {
            SqlParameter Param = null;
            try
            {
                Param = new SqlParameter();
                Param.ParameterName = Name;
                Param.SqlDbType = Type;
                Param.Direction = Direction;
                if (Value != null) { Param.Value = Value; }
            }
            catch (Exception e) { LastError_ = e.Message + System.Environment.NewLine; }
            return Param;
        }

        //#################################################
        //#Create a SQL Command Parameter        
        public SqlParameter CreateParameter(string Name, SqlDbType Type, int Size, ParameterDirection Direction)
        {
            SqlParameter Param = null;
            try
            {
                Param = new SqlParameter();
                Param.ParameterName = Name;
                Param.SqlDbType = Type;
                Param.Size = Size;
                Param.Direction = Direction;
            }
            catch (Exception e) { LastError_ = e.Message + System.Environment.NewLine; }
            return Param;
        }

        //#################################################
        //#Execute a non Query SQL Procedure without parameter
        public int ExecuteProcedureNonQuery(String Script)
        {
            SqlCommand cmdQuery = null;
            int Result = 0;
            LastError_ = "";

            if (Script.Length > 0 && IsOpen())
            {
                try
                {
                    cmdQuery = new SqlCommand();
                    cmdQuery.CommandTimeout = 90;
                    cmdQuery.CommandText = Script;
                    if (IsBegin()) cmdQuery.Transaction = DatabaseTransaction_;
                    cmdQuery.CommandType = CommandType.StoredProcedure;
                    cmdQuery.Connection = Connection_;

                    Result = cmdQuery.ExecuteNonQuery();
                }
                catch (Exception e) { LastError_ = e.Message + System.Environment.NewLine; }
            }

            return Result;
        }

        //#################################################
        //#Execute a non Query SQL Procedure with parameter
        public int ExecuteProcedureNonQuery(String Script, ref SqlParameter[] Params)
        {
            SqlCommand cmdQuery = null;
            int Result = 0;
            LastError_ = "";

            if (Script.Length > 0 && IsOpen())
            {
                try
                {
                    cmdQuery = new SqlCommand();
                    cmdQuery.CommandTimeout = 90;
                    cmdQuery.CommandText = Script;
                    if (IsBegin()) cmdQuery.Transaction = DatabaseTransaction_;
                    cmdQuery.CommandType = CommandType.StoredProcedure;
                    cmdQuery.Connection = Connection_;

                    for (int i = 0; i < Params.Length; i++)
                    {
                        if (Params[i] != null) { cmdQuery.Parameters.Add(Params[i]); }
                    }
                    Result = cmdQuery.ExecuteNonQuery();
                }
                catch (Exception e) { LastError_ = e.Message + System.Environment.NewLine; }
            }

            return Result;
        }

        //#################################################
        //#Execute a SQL Procedure without parameter, it will return a Data Reader
        public SqlDataReader ExecuteProcedure(String Script)
        {
            SqlCommand cmdQuery = null;
            SqlDataReader readr = null;
            LastError_ = "";

            if (Script.Length > 0 && IsOpen())
            {
                try
                {
                    cmdQuery = new SqlCommand();
                    cmdQuery.CommandTimeout = 90;
                    cmdQuery.CommandText = Script;
                    if (IsBegin()) cmdQuery.Transaction = DatabaseTransaction_;
                    cmdQuery.CommandType = CommandType.StoredProcedure;
                    cmdQuery.Connection = Connection_;

                    readr = cmdQuery.ExecuteReader();
                }
                catch (Exception e) { LastError_ = e.Message + System.Environment.NewLine; }
            }

            return readr;
        }

        //#################################################
        //#Execute a SQL Procedure with parameter, it will return a Data Reader
        public SqlDataReader ExecuteProcedure(String Script, ref SqlParameter[] Params)
        {
            SqlCommand cmdQuery = null;
            SqlDataReader readr = null;
            LastError_ = "";

            if (Script.Length > 0 && IsOpen())
            {
                try
                {
                    cmdQuery = new SqlCommand();
                    cmdQuery.CommandTimeout = 90;
                    cmdQuery.CommandText = Script;
                    if (IsBegin()) cmdQuery.Transaction = DatabaseTransaction_;
                    cmdQuery.CommandType = CommandType.StoredProcedure;
                    cmdQuery.Connection = Connection_;

                    for (int i = 0; i < Params.Length; i++)
                    {
                        if (Params[i] != null) { cmdQuery.Parameters.Add(Params[i]); }
                    }
                    readr = cmdQuery.ExecuteReader();
                }
                catch (Exception e) { LastError_ = e.Message + System.Environment.NewLine; }
            }

            return readr;
        }

        //#################################################
        //#Execute a SQL Procedure with parameter, it will fill a DataSet
        public void ExecuteProcedure(String Script, String table, ref DataSet ds, ref SqlParameter[] Params)
        {
            SqlCommand cmdQuery = null;
            SqlDataAdapter Adpt = null;
            LastError_ = "";

            if (Script.Length > 0 && IsOpen())
            {
                try
                {
                    cmdQuery = new SqlCommand();
                    cmdQuery.CommandTimeout = 90;
                    cmdQuery.CommandText = Script;
                    if (IsBegin()) cmdQuery.Transaction = DatabaseTransaction_;
                    cmdQuery.CommandType = CommandType.StoredProcedure;
                    cmdQuery.Connection = Connection_;

                    for (int i = 0; i < Params.Length; i++)
                    {
                        if (Params[i] != null) { cmdQuery.Parameters.Add(Params[i]); }
                    }

                    Adpt = new SqlDataAdapter(cmdQuery);

                    if (ds == null) ds = new DataSet();
                    Adpt.Fill(ds, table);
                    Adpt.Dispose();
                }
                catch (Exception e) { LastError_ = e.Message + System.Environment.NewLine; }
            }
        }

        //#################################################
        //#Execute a SQL Procedure without parameter, it will fill a DataSet
        public void ExecuteProcedure(String Script, String table, ref DataSet ds)
        {
            SqlCommand cmdQuery = null;
            SqlDataAdapter Adpt = null;
            LastError_ = "";

            if (Script.Length > 0 && IsOpen())
            {
                try
                {
                    cmdQuery = new SqlCommand();
                    cmdQuery.CommandTimeout = 90;
                    cmdQuery.CommandText = Script;
                    if (IsBegin()) cmdQuery.Transaction = DatabaseTransaction_;
                    cmdQuery.CommandType = CommandType.StoredProcedure;
                    cmdQuery.Connection = Connection_;

                    Adpt = new SqlDataAdapter(cmdQuery);
                    if (ds == null) ds = new DataSet();
                    Adpt.Fill(ds, table);
                    Adpt.Dispose();
                }
                catch (Exception e) { LastError_ = e.Message + System.Environment.NewLine; }
            }
        }

        //#################################################
        //#Execute a SQL Procedure with parameter, it will fill a DataSet, Query and table name set by property
        public void ExecuteProcedure(ref DataSet ds, ref SqlParameter[] Params)
        {
            SqlCommand cmdQuery = null;
            SqlDataAdapter Adpt = null;
            LastError_ = "";

            if (Query_.Length > 0 && IsOpen())
            {
                try
                {
                    cmdQuery = new SqlCommand();
                    cmdQuery.CommandTimeout = 90;
                    cmdQuery.CommandText = Query_;
                    if (IsBegin()) cmdQuery.Transaction = DatabaseTransaction_;
                    cmdQuery.CommandType = CommandType.StoredProcedure;
                    cmdQuery.Connection = Connection_;

                    for (int i = 0; i < Params.Length; i++)
                    {
                        if (Params[i] != null) { cmdQuery.Parameters.Add(Params[i]); }
                    }

                    Adpt = new SqlDataAdapter(cmdQuery);

                    if (ds == null) ds = new DataSet();
                    Adpt.Fill(ds, Table_);
                    Adpt.Dispose();
                }
                catch (Exception e) { LastError_ = e.Message + System.Environment.NewLine; }
            }
        }

        //#################################################
        //#Execute a SQL Procedure without parameter, it will fill a DataSet, Query and table name set by property
        public void ExecuteProcedure(ref DataSet ds)
        {
            SqlCommand cmdQuery = null;
            SqlDataAdapter Adpt = null;
            LastError_ = "";

            if (Query_.Length > 0 && IsOpen())
            {
                try
                {
                    cmdQuery = new SqlCommand();
                    cmdQuery.CommandTimeout = 90;
                    cmdQuery.CommandText = Query_;
                    if (IsBegin()) cmdQuery.Transaction = DatabaseTransaction_;
                    cmdQuery.CommandType = CommandType.StoredProcedure;
                    cmdQuery.Connection = Connection_;

                    Adpt = new SqlDataAdapter(cmdQuery);
                    if (ds == null) ds = new DataSet();
                    Adpt.Fill(ds, Table_);
                    Adpt.Dispose();
                }
                catch (Exception e) { LastError_ = e.Message + System.Environment.NewLine; }
            }
        }

        //#################################################
        //#Begin Transaction
        public void BeginTrans()
        {
            try
            {
                DatabaseTransaction_ = Connection_.BeginTransaction();
            }
            catch (Exception e) { LastError_ = e.Message + System.Environment.NewLine; }
        }

        //#################################################
        //#Commit Transaction
        public void CommitTrans()
        {
            try
            {
                DatabaseTransaction_.Commit();
            }
            catch (Exception e) { LastError_ = e.Message + System.Environment.NewLine; }
        }

        //#################################################
        //#Rollback Transaction
        public void RollbackTrans()
        {
            try
            {
                DatabaseTransaction_.Rollback();
                isRollback_ = true;
            }
            catch (Exception e) { LastError_ = e.Message + System.Environment.NewLine; }
        }

        //============================================================================= 
        // ******* Utility Properties & Functions **************//
        //=============================================================================

        //#################################################
        //#Get current Connection
        public SqlConnection Connection
        {
            get
            {
                return Connection_;
            }
        }

        //#################################################
        //#Check if transactin is Rollback or Not
        public bool isRollback
        {
            get
            {
                return isRollback_;
            }
        }

        //#################################################
        //#Get is Connected or Not
        public bool isConnected
        {
            get
            {
                return isConnected_;
            }
        }

        //#################################################
        //#Get SQL Error
        public string LastError
        {
            get
            {
                return LastError_;
            }
        }

        //#################################################
        //#Set SQL Statement 
        public string Query
        {
            set
            {
                Query_ = value;
            }
        }

        //#################################################
        //#Set tabel name for Data Set creation
        public string Table
        {
            set
            {
                Table_ = value;
            }
        }

        //######################################################## 
        //# Returns True if the transaction begin
        public bool IsBegin() { if (DatabaseTransaction_ != null) return true; else return false; }

        //######################################################## 
        //# Returns True if the Connection is open
        public Boolean IsOpen() { if (Connection_ != null) return true; else return false; }

        //######################################################## 
        //# Returns True if any error occured
        public Boolean HasError() { if (LastError_.Length > 0) return true; else return false; }


        //#################################################
        //Reset all Variabale and Objects
        public void Reset()
        {
            try
            {
                if (Connection_ != null) { if (Connection_.State == ConnectionState.Open) { Connection_.Dispose(); } }
                Connection_ = null;

                if (DatabaseTransaction_ != null) { DatabaseTransaction_.Rollback(); }
                DatabaseTransaction_ = null;
            }
            catch (Exception) { Connection_ = null; }

            isRollback_ = false;
            isConnected_ = false;
            LastError_ = "";
            CString_ = "";
            Query_ = "";
            Table_ = "";
        }

        //public bool isConnected() { return isConnected_; }
        //public SqlConnection getConnection() { return Connection_; }
        //public String LastError(){ return LastError_; }
        //public void setQuery(String Script) { Query_ = Script; }
        //public void setTable(String tbl) { Table_ = tbl; }
    }
}