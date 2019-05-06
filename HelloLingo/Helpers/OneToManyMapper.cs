using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace Considerate.Helpers {

	namespace Collections {

		/// <summary>
		/// OneToManyMapper
		/// Note: Each mapped value must be unique and associated with only one key.
		/// </summary>

		public class OneToManyMapper<TKey, TValue> {

			private Dictionary<TKey, HashSet<TValue>> KeyToValues { get; set; }
			private Dictionary<TValue,TKey> ValuesToKey { get; set; }

			public OneToManyMapper() {
				Reset();
			}

			public void Reset()
			{
				KeyToValues = new Dictionary<TKey, HashSet<TValue>>();
				ValuesToKey = new Dictionary<TValue, TKey>();
			}

			public int Count => KeyToValues.Count;

			public Dictionary<TKey, HashSet<TValue>> All => KeyToValues;
			public Dictionary<TKey, HashSet<TValue>>.KeyCollection Keys => KeyToValues.Keys;
			public Dictionary<TValue, TKey>.KeyCollection Values => ValuesToKey.Keys;

			public void Add(TKey key, TValue value) {
				lock (KeyToValues) {
					HashSet<TValue> values;
					if (!KeyToValues.TryGetValue(key, out values)) {
						values = new HashSet<TValue>();
						KeyToValues.Add(key, values);
					}

					lock (values)
						values.Add(value);
				}

				lock (ValuesToKey) ValuesToKey.Add(value, key);
			}

			public bool ContainsKey(TKey key) {
				lock (KeyToValues)
					return KeyToValues.ContainsKey(key);
			}

			public IEnumerable<TValue> GetFromKey(TKey key) {
				lock (KeyToValues) {
					HashSet<TValue> values;
					if (KeyToValues.TryGetValue(key, out values))
						return values;
				}

				return Enumerable.Empty<TValue>();
			}

			public bool ContainsValue(TValue value) {
				lock (ValuesToKey) return ValuesToKey.ContainsKey(value);
			}

			public TKey GetFromValue(TValue value) {
				lock (ValuesToKey) return ValuesToKey[value];
			}

			public void Remove(TValue value) {
				TKey key;
				lock (ValuesToKey) {
					key = ValuesToKey[value];
					ValuesToKey.Remove(value);
				}

				lock (KeyToValues) {
					HashSet<TValue> values;
					if (!KeyToValues.TryGetValue(key, out values))
						return;

					lock (values) {
						values.Remove(value);
						if (values.Count == 0) 
							KeyToValues.Remove(key);
					}
				}
			}

		}

	}

}

