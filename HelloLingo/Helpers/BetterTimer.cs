using System;
using System.Timers;

namespace Considerate.Helpers {

	public class BetterTimer
	{
		private Timer _timer;
		private Action _onTimerComplete;
		private event Action<Exception> OnError;

		public bool Running { get; private set; }
		public bool AutoReset { get; set; } = false;

		public BetterTimer(Action<Exception> mustHaveErrorHandler) {
			OnError += mustHaveErrorHandler;
		}

		public void Start(Action onTimerStart, Action onTimerComplete, int intervalInSecs)
		{
			_onTimerComplete = onTimerComplete;

			if (Running) Cancel();
			else onTimerStart?.Invoke();

			_timer = new Timer(intervalInSecs*1000) {AutoReset = AutoReset};
			_timer.Elapsed += /*(sender, args) =>*/ delegate{
				// The Timer, by running in its own thread, swallow any exceptions occuring in the Elapsed handler,
				// hence the need to catch excpetions and manually rethrow exceptions on the main thread
				try  { Complete(); }
				catch (Exception ex) { OnError?.Invoke(ex); }
			};
			_timer.Start();
			Running = true;
		}

		public void ReTime(int intervalInSecs) {
			_timer.Interval = intervalInSecs * 1000;
		}

		public void Cancel()
		{
			// Usage of ? because some method might call this even want not in use
			_timer?.Stop();
			_timer?.Dispose();
			Running = false;
		}

		public void Complete()
		{
			if (!AutoReset) Cancel();
			_onTimerComplete?.Invoke();
		}

	}

}

