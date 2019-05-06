using System.Linq;
using System.Collections.Generic;

namespace Considerate.Hellolingo {

	public class Result<T>
	{
		public static Result<bool> True => new Result<bool>(true);
		public static Result<bool> False => new Result<bool>(false);
		public static Result<object> Null => new Result<object>(null);

		public T Value;
		public LogReports Reports = new LogReports();

		public Result() { }
		public Result(T value) { Value = value; }
		public Result(T value, LogTag tag, LogLevel level = LogLevel.Info) : this(value, new LogReport(tag, level)) {}
		public Result(T value, LogReport report) {
			Value = value;
			Reports.Add(report);
		}
		public Result(T value, LogTag tag, object logValue, LogLevel level) {
			Value = value;
			Reports.AddReport(tag, logValue, level);
		}

		public bool HasLogTag(LogTag logTag) => Reports.Any(logReport => logReport.Tag == logTag);
	}

	public class LogReports : List<LogReport> {
		public LogReports() { }
		public LogReports(LogReport report) { Add(report); }
		public LogReports(LogTag tag, object value = null, LogLevel level = LogLevel.Info) { AddReport(tag, value, level); }
		public void AddReport(LogTag tag, object value, LogLevel level = LogLevel.Info) => Add(new LogReport(tag, value, level));
	}

	public class LogReport {
		public LogTag Tag { get; }
		public object Data { get; }
		public LogLevel Level { get; }

		public LogReport(LogTag tag, object data = null, LogLevel level = LogLevel.Info) {
			Tag = tag;
			Data = data;
			Level = level;
		}
	}


}

