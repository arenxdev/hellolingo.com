using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Text;
using Microsoft.Data.Tools.Schema.Sql.UnitTesting;
using Microsoft.Data.Tools.Schema.Sql.UnitTesting.Conditions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace HelloLingoSql.Test {
	[TestClass()]
	public class StoredProcedure : SqlDatabaseTestClass {

		public StoredProcedure() {
			InitializeComponent();
		}

		[TestInitialize()]
		public void TestInitialize() {
			base.InitializeTest();
		}
		[TestCleanup()]
		public void TestCleanup() {
			base.CleanupTest();
		}

		#region Designer support code

		/// <summary> 
		/// Required method for Designer support - do not modify 
		/// the contents of this method with the code editor.
		/// </summary>
		private void InitializeComponent() {
			Microsoft.Data.Tools.Schema.Sql.UnitTesting.SqlDatabaseTestAction TestTheMonthBefore_TestAction;
			System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(StoredProcedure));
			Microsoft.Data.Tools.Schema.Sql.UnitTesting.Conditions.ScalarValueCondition ageToBe15;
			Microsoft.Data.Tools.Schema.Sql.UnitTesting.SqlDatabaseTestAction testInitializeAction;
			Microsoft.Data.Tools.Schema.Sql.UnitTesting.SqlDatabaseTestAction TestTheMonthOn_TestAction;
			Microsoft.Data.Tools.Schema.Sql.UnitTesting.Conditions.ScalarValueCondition ageToBe16;
			Microsoft.Data.Tools.Schema.Sql.UnitTesting.SqlDatabaseTestAction TestTheMonthAfter_TestAction;
			Microsoft.Data.Tools.Schema.Sql.UnitTesting.Conditions.ScalarValueCondition ageToBe16Too;
			this.TestTheMonthBeforeData = new Microsoft.Data.Tools.Schema.Sql.UnitTesting.SqlDatabaseTestActions();
			this.TestTheMonthOnData = new Microsoft.Data.Tools.Schema.Sql.UnitTesting.SqlDatabaseTestActions();
			this.TestTheMonthAfterData = new Microsoft.Data.Tools.Schema.Sql.UnitTesting.SqlDatabaseTestActions();
			TestTheMonthBefore_TestAction = new Microsoft.Data.Tools.Schema.Sql.UnitTesting.SqlDatabaseTestAction();
			ageToBe15 = new Microsoft.Data.Tools.Schema.Sql.UnitTesting.Conditions.ScalarValueCondition();
			testInitializeAction = new Microsoft.Data.Tools.Schema.Sql.UnitTesting.SqlDatabaseTestAction();
			TestTheMonthOn_TestAction = new Microsoft.Data.Tools.Schema.Sql.UnitTesting.SqlDatabaseTestAction();
			ageToBe16 = new Microsoft.Data.Tools.Schema.Sql.UnitTesting.Conditions.ScalarValueCondition();
			TestTheMonthAfter_TestAction = new Microsoft.Data.Tools.Schema.Sql.UnitTesting.SqlDatabaseTestAction();
			ageToBe16Too = new Microsoft.Data.Tools.Schema.Sql.UnitTesting.Conditions.ScalarValueCondition();
			// 
			// TestTheMonthBefore_TestAction
			// 
			TestTheMonthBefore_TestAction.Conditions.Add(ageToBe15);
			resources.ApplyResources(TestTheMonthBefore_TestAction, "TestTheMonthBefore_TestAction");
			// 
			// ageToBe15
			// 
			ageToBe15.ColumnNumber = 1;
			ageToBe15.Enabled = true;
			ageToBe15.ExpectedValue = "15";
			ageToBe15.Name = "ageToBe15";
			ageToBe15.NullExpected = false;
			ageToBe15.ResultSet = 1;
			ageToBe15.RowNumber = 1;
			// 
			// testInitializeAction
			// 
			resources.ApplyResources(testInitializeAction, "testInitializeAction");
			// 
			// TestTheMonthBeforeData
			// 
			this.TestTheMonthBeforeData.PosttestAction = null;
			this.TestTheMonthBeforeData.PretestAction = null;
			this.TestTheMonthBeforeData.TestAction = TestTheMonthBefore_TestAction;
			// 
			// TestTheMonthOnData
			// 
			this.TestTheMonthOnData.PosttestAction = null;
			this.TestTheMonthOnData.PretestAction = null;
			this.TestTheMonthOnData.TestAction = TestTheMonthOn_TestAction;
			// 
			// TestTheMonthOn_TestAction
			// 
			TestTheMonthOn_TestAction.Conditions.Add(ageToBe16);
			resources.ApplyResources(TestTheMonthOn_TestAction, "TestTheMonthOn_TestAction");
			// 
			// ageToBe16
			// 
			ageToBe16.ColumnNumber = 1;
			ageToBe16.Enabled = true;
			ageToBe16.ExpectedValue = "16";
			ageToBe16.Name = "ageToBe16";
			ageToBe16.NullExpected = false;
			ageToBe16.ResultSet = 1;
			ageToBe16.RowNumber = 1;
			// 
			// TestTheMonthAfterData
			// 
			this.TestTheMonthAfterData.PosttestAction = null;
			this.TestTheMonthAfterData.PretestAction = null;
			this.TestTheMonthAfterData.TestAction = TestTheMonthAfter_TestAction;
			// 
			// TestTheMonthAfter_TestAction
			// 
			TestTheMonthAfter_TestAction.Conditions.Add(ageToBe16Too);
			resources.ApplyResources(TestTheMonthAfter_TestAction, "TestTheMonthAfter_TestAction");
			// 
			// ageToBe16Too
			// 
			ageToBe16Too.ColumnNumber = 1;
			ageToBe16Too.Enabled = true;
			ageToBe16Too.ExpectedValue = "16";
			ageToBe16Too.Name = "ageToBe16Too";
			ageToBe16Too.NullExpected = false;
			ageToBe16Too.ResultSet = 1;
			ageToBe16Too.RowNumber = 1;
			// 
			// StoredProcedure
			// 
			this.TestInitializeAction = testInitializeAction;
		}

		#endregion


		#region Additional test attributes
		//
		// You can use the following additional attributes as you write your tests:
		//
		// Use ClassInitialize to run code before running the first test in the class
		// [ClassInitialize()]
		// public static void MyClassInitialize(TestContext testContext) { }
		//
		// Use ClassCleanup to run code after all tests in a class have run
		// [ClassCleanup()]
		// public static void MyClassCleanup() { }
		//
		#endregion

		[TestMethod()]
		public void TestTheMonthBefore() {
			SqlDatabaseTestActions testActions = this.TestTheMonthBeforeData;
			// Execute the pre-test script
			// 
			System.Diagnostics.Trace.WriteLineIf((testActions.PretestAction != null), "Executing pre-test script...");
			SqlExecutionResult[] pretestResults = TestService.Execute(this.PrivilegedContext, this.PrivilegedContext, testActions.PretestAction);
			try {
				// Execute the test script
				// 
				System.Diagnostics.Trace.WriteLineIf((testActions.TestAction != null), "Executing test script...");
				SqlExecutionResult[] testResults = TestService.Execute(this.ExecutionContext, this.PrivilegedContext, testActions.TestAction);
			} finally {
				// Execute the post-test script
				// 
				System.Diagnostics.Trace.WriteLineIf((testActions.PosttestAction != null), "Executing post-test script...");
				SqlExecutionResult[] posttestResults = TestService.Execute(this.PrivilegedContext, this.PrivilegedContext, testActions.PosttestAction);
			}
		}
		[TestMethod()]
		public void TestTheMonthOn() {
			SqlDatabaseTestActions testActions = this.TestTheMonthOnData;
			// Execute the pre-test script
			// 
			System.Diagnostics.Trace.WriteLineIf((testActions.PretestAction != null), "Executing pre-test script...");
			SqlExecutionResult[] pretestResults = TestService.Execute(this.PrivilegedContext, this.PrivilegedContext, testActions.PretestAction);
			try {
				// Execute the test script
				// 
				System.Diagnostics.Trace.WriteLineIf((testActions.TestAction != null), "Executing test script...");
				SqlExecutionResult[] testResults = TestService.Execute(this.ExecutionContext, this.PrivilegedContext, testActions.TestAction);
			} finally {
				// Execute the post-test script
				// 
				System.Diagnostics.Trace.WriteLineIf((testActions.PosttestAction != null), "Executing post-test script...");
				SqlExecutionResult[] posttestResults = TestService.Execute(this.PrivilegedContext, this.PrivilegedContext, testActions.PosttestAction);
			}
		}
		[TestMethod()]
		public void TestTheMonthAfter() {
			SqlDatabaseTestActions testActions = this.TestTheMonthAfterData;
			// Execute the pre-test script
			// 
			System.Diagnostics.Trace.WriteLineIf((testActions.PretestAction != null), "Executing pre-test script...");
			SqlExecutionResult[] pretestResults = TestService.Execute(this.PrivilegedContext, this.PrivilegedContext, testActions.PretestAction);
			try {
				// Execute the test script
				// 
				System.Diagnostics.Trace.WriteLineIf((testActions.TestAction != null), "Executing test script...");
				SqlExecutionResult[] testResults = TestService.Execute(this.ExecutionContext, this.PrivilegedContext, testActions.TestAction);
			} finally {
				// Execute the post-test script
				// 
				System.Diagnostics.Trace.WriteLineIf((testActions.PosttestAction != null), "Executing post-test script...");
				SqlExecutionResult[] posttestResults = TestService.Execute(this.PrivilegedContext, this.PrivilegedContext, testActions.PosttestAction);
			}
		}


		private SqlDatabaseTestActions TestTheMonthBeforeData;
		private SqlDatabaseTestActions TestTheMonthOnData;
		private SqlDatabaseTestActions TestTheMonthAfterData;
	}
}
