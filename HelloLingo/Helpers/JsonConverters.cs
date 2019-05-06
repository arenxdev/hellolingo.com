using System;
using System.Collections.Generic;
using System.Linq;
using Considerate.Hellolingo.UserCommons;
using Considerate.Helpers.Communication;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Considerate.Helpers {

	namespace JsonConverters {

		public class ToStringConverter : JsonConverter {
			public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer) {
				writer.WriteRawValue("\"" + value.ToString() + "\"");
			}

			public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
			{
				throw new NotImplementedException();
			}

			public override bool CanConvert(Type objectType) {
				return typeof(string).IsAssignableFrom(objectType);
			}

			public override bool CanRead => false;
		}

		public class TupleJsonArrayConverter : JsonConverter
		{
			public override bool CanConvert(Type objectType)
			{
				return objectType.IsGenericType &&
					   (objectType.GetGenericTypeDefinition() == typeof(Tuple<>) ||
						objectType.GetGenericTypeDefinition() == typeof(Tuple<,>) ||
						objectType.GetGenericTypeDefinition() == typeof(Tuple<,,>) ||
						objectType.GetGenericTypeDefinition() == typeof(Tuple<,,,>) ||
						objectType.GetGenericTypeDefinition() == typeof(Tuple<,,,,>) ||
						objectType.GetGenericTypeDefinition() == typeof(Tuple<,,,,,>) ||
						objectType.GetGenericTypeDefinition() == typeof(Tuple<,,,,,,>) ||
						objectType.GetGenericTypeDefinition() == typeof(Tuple<,,,,,,,>));
			}

			public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
			{
				try
				{
					var array = JArray.Load(reader);

					var tupleJson = new JObject();
					for (int i = 0; i < array.Count; i++)
					{
						tupleJson.Add($"Item{i + 1}", array[i]);
					}

					return tupleJson.ToObject(objectType, serializer);
				}
				catch (JsonReaderException)
				{
					return JToken.Load(reader).ToObject(objectType);
				}

				// var tupleInnerTypes = objectType.GetGenericArguments();
				// var constructorArgs = tupleInnerTypes.Select((t, i) => (array.Count < i) ? array[i].ToObject(t, serializer) : null).ToArray();
				// return Activator.CreateInstance(objectType, constructorArgs);
			}

			public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
			{
				var genericArgs = value.GetType().GetGenericArguments();
				var itemsArray = genericArgs.Select((a, i) => value.GetType().GetProperty($"Item{i + 1}").GetValue(value, null)).ToArray();

				serializer.Serialize(writer, itemsArray);
			}

			public override bool CanRead => true;
		}

		public class MultiValueDictionaryConverter : JsonConverter
		{
			public override bool CanConvert(Type objectType)
			{
				return objectType.IsGenericType && objectType.GetGenericTypeDefinition() == typeof (MultiValueDictionary<,>);
			}

			public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
			{
				throw new NotImplementedException();
			}

			public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
			{
				var jObject = JObject.FromObject(value);

				jObject.WriteTo(writer);
			}

			public override bool CanRead => false;
		}

		//Andriy: This converter is not in use and not fully implement, it breaks some other serilization rules.
		public class UserIdToIntConverter : JsonConverter
		{
			public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer) {
				int intValue = (UserId)value;
				serializer.Serialize(writer, intValue);
			}

			public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
			{
				// All integers are treated as long type by Json.Net, but we have userId as int
				if(reader.ValueType == typeof(long)) {
					int value = serializer.Deserialize<int>(reader);
					return new UserId(value);
				}
				return new UserId(0);
			}

			public override bool CanRead => true;
			public override bool CanConvert(Type objectType) => objectType.GetElementType() == typeof(UserId);
		}
		
		public class OrderIdToIntConverter : JsonConverter
		{
			public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer) {
				int intValue = (OrderId)value;
				serializer.Serialize(writer, intValue);
			}

			public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
			{
				// All integers are treated as long type by Json.Net, but we have orderId as int
				if(reader.ValueType == typeof(long)) {
					int value = serializer.Deserialize<int>(reader);
					return new OrderId(value);
				}
				return new OrderId(0);
			}

			public override bool CanRead => true;
			public override bool CanConvert(Type objectType) => objectType.GetElementType() == typeof(OrderId);
		}
	}

}

