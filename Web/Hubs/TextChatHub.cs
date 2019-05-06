using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Data.Entity;
using System.Globalization;
using Considerate.Hellolingo.DataAccess;
using Considerate.Hellolingo.Enumerables;
using Considerate.Hellolingo.Helpers;
using Considerate.Hellolingo.TextChat;
using Considerate.Hellolingo.UserCommons;
using Considerate.Hellolingo.WebApp.Helpers;
using Considerate.Helpers;
using Considerate.Helpers.Communication;
using Humanizer;
using Newtonsoft.Json;

namespace Considerate.Hellolingo.WebApp.Hubs {

	public interface ITextChatHubClient {
		
		// Non-Guaranteed: Calling these doesn't guarantee delivery to the client
		void ResetClient();
		void Pong(int? lastQueuedOrderId);
		void LeaveRoom(RoomId roomId);

		// Guaranteed: This method is used for guaranteed delivery. Do not call directly. You need an AckableQueue for it
		void Do(List<QueuedMessage<HubClientInvoker>> messages);
	}

	[Authorize]
	public class TextChatHub : Hub<ITextChatHubClient>
	{
		private readonly TextChatHubCtrl _hubCtrl;

		private readonly List<TextChatUser> _fakeProdUsers = new List<TextChatUser> {
			// SQL Select for active users : select 2017-BirthYear [Age], Country, FirstName, gender, id, 'false'[IsNoPrivateChat],'false'[IsSharedTalkMember],Knows, Learns, LastName, Location from users where id between 844 and 5522 and knows not in (1,2,3,4,5) and learns not in (1,2,3,4,5)
			// Excel Concat: ="new TextChatUser { Age = "&A30&", Country =  "&B30&", FirstName = """&C30&""", Gender = """&D30&""", Id = "&E30&", IsNoPrivateChat = "&G30&", IsSharedTalkMember = "&H30&", Knows = "&I30&", Learns = "&J30&", LastName = """&K30&""", Location = """&L30&""" },"
			new TextChatUser { Age = 52, Country =  100, FirstName = "Vlam",      Gender = "F", Id = 784, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 1, Learns = 11, LastName = "Vv", Location = "Florida" },
			new TextChatUser { Age = 21, Country =  123, FirstName = "Евгения",      Gender = "F", Id = 2944, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 38, LastName = "Морозкина", Location = "Ишимбай" },
			new TextChatUser { Age = 37, Country =  113, FirstName = "Leide",     Gender = "F", Id = 785, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 9, Learns = 1, LastName = "Sykes", Location = "Nova Canaã" },
			new TextChatUser { Age = 53, Country =  113, FirstName = "Maria heldir", Gender = "F", Id = 851, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 9, Learns = 10, LastName = "Antunes", Location = "Ubatuba" },
			new TextChatUser { Age = 22, Country =  154, FirstName = "Brian",     Gender = "M", Id = 786, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 2, Learns = 1, LastName = "Herrera", Location = "Graneros" },
			new TextChatUser { Age = 26, Country =  127, FirstName = "Mike",         Gender = "M", Id = 992, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 11, Learns = 7, LastName = "Shin", Location = "NULL" },
			new TextChatUser { Age = 22, Country =  143, FirstName = "Sebastian", Gender = "M", Id = 787, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 2, Learns = 1, LastName = "Palacios", Location = "Bogota" },
			new TextChatUser { Age = 25, Country =  122, FirstName = "Pawee",        Gender = "F", Id = 1002, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 22, Learns = 7, LastName = "Phaecheku", Location = "Bangkok" },
			new TextChatUser { Age = 21, Country =  113, FirstName = "Tainá",     Gender = "F", Id = 788, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 9, Learns = 1, LastName = "Anjos", Location = "Porto Alegre" },
			new TextChatUser { Age = 35, Country =  133, FirstName = "Iam",          Gender = "M", Id = 1031, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 18, Learns = 8, LastName = "Youhanen", Location = "Stockholm" },
			new TextChatUser { Age = 26, Country =  142, FirstName = "Alejandra", Gender = "F", Id = 789, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 2, Learns = 11, LastName = "Luna", Location = "Arequipa" },
			new TextChatUser { Age = 41, Country =  121, FirstName = "Janet",        Gender = "F", Id = 1041, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 11, LastName = "Lin", Location = "NULL" },
			new TextChatUser { Age = 37, Country =  109, FirstName = "Sally",     Gender = "F", Id = 790, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "Wang", Location = "北京" },
			new TextChatUser { Age = 47, Country =  111, FirstName = "Anto",         Gender = "F", Id = 1244, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 6, Learns = 21, LastName = "De Vincenzi", Location = "Palermo" },
			new TextChatUser { Age = 21, Country =  119, FirstName = "Cynthia",   Gender = "F", Id = 791, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 2, Learns = 1, LastName = "Gro", Location = "México" },
			new TextChatUser { Age = 35, Country =  126, FirstName = "Francesco",    Gender = "M", Id = 1296, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 6, Learns = 23, LastName = "Surzhan", Location = "Krakow" },
			new TextChatUser { Age = 27, Country =  255, FirstName = "Bolortuya", Gender = "F", Id = 792, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 81, Learns = 1, LastName = "Amar", Location = "Ulaanbaatar" },
			new TextChatUser { Age = 26, Country =  216, FirstName = "Nussipbaev",   Gender = "M", Id = 1337, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 89, Learns = 10, LastName = "Tuleshova", Location = "Алматы" },
			new TextChatUser { Age = 24, Country =  112, FirstName = "Gisele",    Gender = "F", Id = 793, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 2, Learns = 1, LastName = "Hhts", Location = "La Plata" },
			new TextChatUser { Age = 23, Country =  109, FirstName = "Liyaha",       Gender = "F", Id = 1389, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 11, LastName = "Yang", Location = "成都" },
			new TextChatUser { Age = 24, Country =  148, FirstName = "Joseph",    Gender = "M", Id = 794, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 1, Learns = 2, LastName = "Doeteh", Location = "Accra" },
			new TextChatUser { Age = 38, Country =  116, FirstName = "Yanet",        Gender = "F", Id = 1573, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 14, Learns = 11, LastName = "Dacquiado", Location = "Rizal" },
			new TextChatUser { Age = 20, Country =  109, FirstName = "Sherry",    Gender = "F", Id = 795, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "Liu", Location = "Bj" },
			new TextChatUser { Age = 42, Country =  123, FirstName = "Анна",         Gender = "F", Id = 1578, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 6, LastName = "Козлов", Location = "Якутск" },
			new TextChatUser { Age = 23, Country =  100, FirstName = "Selah",     Gender = "F", Id = 796, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 1, Learns = 5, LastName = "R.", Location = "Tricities" },
			new TextChatUser { Age = 29, Country =  109, FirstName = "Amara",        Gender = "F", Id = 1623, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 13, LastName = "Z.", Location = "NULL" },
			new TextChatUser { Age = 24, Country =  119, FirstName = "Vicky",     Gender = "F", Id = 797, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 2, Learns = 1, LastName = "Perez", Location = "Monterrey" },
			new TextChatUser { Age = 30, Country =  202, FirstName = "Nadia",        Gender = "F", Id = 1794, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 6, LastName = "Rostovsky", Location = "Донецк" },
			new TextChatUser { Age = 30, Country =  123, FirstName = "Andrey",    Gender = "M", Id = 798, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Khmarenkov", Location = "Kolomna" },
			new TextChatUser { Age = 31, Country =  103, FirstName = "Himayoon",     Gender = "M", Id = 1884, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 12, Learns = 8, LastName = "Km", Location = "Kashmir" },
			new TextChatUser { Age = 24, Country =  109, FirstName = "Jessie",    Gender = "F", Id = 799, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "Yang", Location = "Qingdao" },
			new TextChatUser { Age = 28, Country =  111, FirstName = "Federico",     Gender = "M", Id = 1889, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 6, Learns = 7, LastName = "Muca", Location = "Verona" },
			new TextChatUser { Age = 21, Country =  127, FirstName = "Elva",      Gender = "F", Id = 800, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 11, Learns = 1, LastName = "Park", Location = "Seoul" },
			new TextChatUser { Age = 35, Country =  121, FirstName = "Chu",          Gender = "F", Id = 1917, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 11, LastName = "Chen", Location = "Taipei" },
			new TextChatUser { Age = 39, Country =  111, FirstName = "Marianna",  Gender = "F", Id = 801, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 6, Learns = 1, LastName = "Valenti", Location = "Bari" },
			new TextChatUser { Age = 32, Country =  253, FirstName = "Slavko",       Gender = "M", Id = 1969, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 31, Learns = 84, LastName = "Curcin", Location = "Belgrade" },
			new TextChatUser { Age = 29, Country =  109, FirstName = "Yuyan",     Gender = "F", Id = 802, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "L韩", Location = "Dongying" },
			new TextChatUser { Age = 28, Country =  202, FirstName = "Настя",        Gender = "F", Id = 2004, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 55, Learns = 8, LastName = "Щеникова", Location = "Днепропетровск" },
			new TextChatUser { Age = 21, Country =  123, FirstName = "Илья",      Gender = "M", Id = 803, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Виляева", Location = "Воронеж" },
			new TextChatUser { Age = 23, Country =  122, FirstName = "Parichart",    Gender = "F", Id = 2098, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 22, Learns = 7, LastName = "Promta", Location = "Bangkok" },
			new TextChatUser { Age = 46, Country =  202, FirstName = "Лариса",    Gender = "F", Id = 804, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Петрова", Location = "Николаев" },
			new TextChatUser { Age = 24, Country =  123, FirstName = "Azrail",       Gender = "M", Id = 2109, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 10, LastName = "Jusy", Location = "Magas" },
			new TextChatUser { Age = 20, Country =  123, FirstName = "Emma",      Gender = "F", Id = 805, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Kirdiushkina", Location = "NULL" },
			new TextChatUser { Age = 26, Country =  151, FirstName = "Ha",           Gender = "F", Id = 2197, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 27, Learns = 7, LastName = "Thao", Location = "Ho Chi Minh" },
			new TextChatUser { Age = 24, Country =  151, FirstName = "Tuan",      Gender = "M", Id = 806, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 27, Learns = 1, LastName = "Trần", Location = "Ho Chi Minh city" },
			new TextChatUser { Age = 29, Country =  109, FirstName = "Lubna",        Gender = "F", Id = 2321, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 10, LastName = "Zhou", Location = "深圳" },
			new TextChatUser { Age = 21, Country =  123, FirstName = "Nastya",    Gender = "F", Id = 807, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Deynekin", Location = "Козьмодемьянск" },
			new TextChatUser { Age = 45, Country =  140, FirstName = "Oleg",         Gender = "M", Id = 2398, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 30, Learns = 8, LastName = "Gan", Location = "Helsinki" },
			new TextChatUser { Age = 27, Country =  122, FirstName = "Pook",      Gender = "F", Id = 808, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 22, Learns = 1, LastName = "Noimatunn", Location = "Bkk" },
			new TextChatUser { Age = 35, Country =  111, FirstName = "Luca",         Gender = "M", Id = 2409, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 6, Learns = 21, LastName = "Congiu", Location = "Arezzo" },
			new TextChatUser { Age = 45, Country =  106, FirstName = "Gabriel",   Gender = "M", Id = 809, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 2, Learns = 1, LastName = "Camelas", Location = "Barcelona" },
			new TextChatUser { Age = 20, Country =  224, FirstName = "Ana-Maria",    Gender = "F", Id = 2539, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 25, Learns = 6, LastName = "Tsvetcov", Location = "NULL" },
			new TextChatUser { Age = 34, Country =  111, FirstName = "Gabriele",  Gender = "M", Id = 810, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 6, Learns = 1, LastName = "Lezzi", Location = "Napoli" },
			new TextChatUser { Age = 50, Country =  127, FirstName = "Oasis",        Gender = "M", Id = 2599, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 11, Learns = 7, LastName = "Jisong", Location = "서울" },
			new TextChatUser { Age = 39, Country =  105, FirstName = "Davood",    Gender = "M", Id = 813, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 21, Learns = 1, LastName = "Mi", Location = "Brisbane" },
			new TextChatUser { Age = 20, Country =  113, FirstName = "Lisangela",    Gender = "F", Id = 2643, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 9, Learns = 6, LastName = "Alves", Location = "Fortaleza" },
			new TextChatUser { Age = 29, Country =  109, FirstName = "Liang",     Gender = "M", Id = 814, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "何.", Location = "Zhengzhou" },
			new TextChatUser { Age = 24, Country =  174, FirstName = "Stefan",    Gender = "M", Id = 815, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 1, Learns = 56, LastName = "Kubik", Location = "Cadca" },
			new TextChatUser { Age = 47, Country =  113, FirstName = "Melissa",      Gender = "F", Id = 3143, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 9, Learns = 6, LastName = "Cabral", Location = "Ma" },
			new TextChatUser { Age = 24, Country =  109, FirstName = "Mable",     Gender = "F", Id = 816, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "Hao", Location = "珠海" },
			new TextChatUser { Age = 36, Country =  120, FirstName = "Amin",         Gender = "M", Id = 3242, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 21, Learns = 15, LastName = "Ntini", Location = "Antwerpen" },
			new TextChatUser { Age = 21, Country =  116, FirstName = "Clarence",  Gender = "F", Id = 817, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 14, Learns = 4, LastName = "Mauricio", Location = "Davao city" },
			new TextChatUser { Age = 46, Country =  114, FirstName = "Babak",        Gender = "M", Id = 3261, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 21, Learns = 6, LastName = "Pourdarvish", Location = "Rasht" },
			new TextChatUser { Age = 24, Country =  109, FirstName = "Summer",    Gender = "F", Id = 818, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "Wu", Location = "Chengdu" },
			new TextChatUser { Age = 33, Country =  121, FirstName = "Yifang",       Gender = "F", Id = 3307, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 21, Learns = 11, LastName = "Huseh", Location = "NULL" },
			new TextChatUser { Age = 25, Country =  113, FirstName = "Yago",      Gender = "M", Id = 819, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 9, Learns = 1, LastName = "Segredo", Location = "Salvador" },
			new TextChatUser { Age = 30, Country =  113, FirstName = "Midiã",        Gender = "F", Id = 3527, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 9, Learns = 10, LastName = "Mota", Location = "Belo horizonte" },
			new TextChatUser { Age = 27, Country =  109, FirstName = "Ariel",     Gender = "F", Id = 820, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "冀.", Location = "NULL" },
			new TextChatUser { Age = 32, Country =  121, FirstName = "Zoe",          Gender = "F", Id = 3620, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 11, LastName = "Loh", Location = "NULL" },
			new TextChatUser { Age = 30, Country =  109, FirstName = "Kyle",      Gender = "M", Id = 821, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "Sun", Location = "上海" },
			new TextChatUser { Age = 32, Country =  132, FirstName = "Poppy",        Gender = "F", Id = 3678, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 34, Learns = 15, LastName = "Takaku", Location = "Yogyakarta" },
			new TextChatUser { Age = 29, Country =  107, FirstName = "Yuki",      Gender = "F", Id = 822, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 4, Learns = 1, LastName = "Nag", Location = "NULL" },
			new TextChatUser { Age = 33, Country =  123, FirstName = "Dmitriy",   Gender = "M", Id = 823, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Maki", Location = "Москва" },
			new TextChatUser { Age = 38, Country =  121, FirstName = "Penny",        Gender = "F", Id = 3903, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 11, LastName = "Chiu", Location = "NULL" },
			new TextChatUser { Age = 34, Country =  109, FirstName = "Emma",      Gender = "F", Id = 824, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "Peng", Location = "Qingdao" },
			new TextChatUser { Age = 34, Country =  155, FirstName = "Szabolcs",  Gender = "M", Id = 825, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 36, Learns = 1, LastName = "Tóbel", Location = "Budapest" },
			new TextChatUser { Age = 46, Country =  186, FirstName = "Masis",        Gender = "M", Id = 3918, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 51, Learns = 8, LastName = "Galstyan", Location = "Yerevan" },
			new TextChatUser { Age = 43, Country =  109, FirstName = "Shohe",     Gender = "M", Id = 826, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 4, LastName = "Tan", Location = "西安" },
			new TextChatUser { Age = 25, Country =  202, FirstName = "Лилия",        Gender = "F", Id = 3939, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 23, LastName = "Жиленко", Location = "Симферополь" },
			new TextChatUser { Age = 27, Country =  202, FirstName = "Viktor",    Gender = "M", Id = 827, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Porada", Location = "Donetsk" },
			new TextChatUser { Age = 28, Country =  114, FirstName = "Badr",         Gender = "M", Id = 4071, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 10, Learns = 8, LastName = "Qadiri", Location = "Hydarabad" },
			new TextChatUser { Age = 22, Country =  109, FirstName = "Richard",   Gender = "F", Id = 828, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "W.", Location = "Jiangsu" },
			new TextChatUser { Age = 40, Country =  199, FirstName = "Oksana",       Gender = "F", Id = 4332, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 6, LastName = "Кравчук", Location = "Minsk" },
			new TextChatUser { Age = 22, Country =  109, FirstName = "Zoei",      Gender = "F", Id = 829, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "Ting", Location = "Shanghai" },
			new TextChatUser { Age = 40, Country =  111, FirstName = "Marco",        Gender = "M", Id = 4658, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 6, Learns = 36, LastName = "Sansone", Location = "Roma" },
			new TextChatUser { Age = 23, Country =  113, FirstName = "Jones",     Gender = "M", Id = 830, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 9, Learns = 1, LastName = "Mendes", Location = "Sao paulo" },
			new TextChatUser { Age = 32, Country =  139, FirstName = "Hughu",        Gender = "M", Id = 4743, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 19, Learns = 8, LastName = "Kats", Location = "Njiljl" },
			new TextChatUser { Age = 20, Country =  199, FirstName = "Евгений",   Gender = "M", Id = 831, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 5, LastName = "Tutu", Location = "Ивацевичи" },
			new TextChatUser { Age = 37, Country =  133, FirstName = "Mattias",      Gender = "M", Id = 4759, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 10, Learns = 18, LastName = "Freu", Location = "Mjölby" },
			new TextChatUser { Age = 31, Country =  142, FirstName = "Crystal",   Gender = "F", Id = 832, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 2, Learns = 1, LastName = "Cotrina", Location = "Trujillo" },
			new TextChatUser { Age = 31, Country =  121, FirstName = "Ohoh",         Gender = "F", Id = 4932, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 11, LastName = "Chen", Location = "NULL" },
			new TextChatUser { Age = 41, Country =  252, FirstName = "Dana",      Gender = "F", Id = 833, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 10, Learns = 1, LastName = "Vu", Location = "Aden" },
			new TextChatUser { Age = 41, Country =  152, FirstName = "Pedro",        Gender = "M", Id = 4970, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 9, Learns = 6, LastName = "Pinto", Location = "Lisboa" },
			new TextChatUser { Age = 27, Country =  113, FirstName = "Andres",    Gender = "M", Id = 834, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 9, Learns = 1, LastName = "Vaz Miranda", Location = "Rio de Janeiro" },
			new TextChatUser { Age = 30, Country =  139, FirstName = "Оксана",       Gender = "F", Id = 4973, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 19, LastName = "Gkiokas", Location = "NULL" },
			new TextChatUser { Age = 35, Country =  113, FirstName = "Jocelito",  Gender = "M", Id = 835, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 9, Learns = 1, LastName = "Terra", Location = "Campo Largo - Pr" },
			new TextChatUser { Age = 30, Country =  199, FirstName = "Olga",         Gender = "F", Id = 5107, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 26, LastName = "Шурмей", Location = "Minsk" },
			new TextChatUser { Age = 21, Country =  113, FirstName = "Clara",     Gender = "F", Id = 836, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 9, Learns = 1, LastName = "César", Location = "São paulo" },
			new TextChatUser { Age = 29, Country =  194, FirstName = "Nika",         Gender = "M", Id = 5112, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 82, Learns = 6, LastName = "Sharmiashvili", Location = "Tbilisi" },
			new TextChatUser { Age = 50, Country =  113, FirstName = "Jose",      Gender = "M", Id = 837, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 9, Learns = 1, LastName = "Lima", Location = "Rio de janeiro" },
			new TextChatUser { Age = 22, Country =  162, FirstName = "Amina",        Gender = "F", Id = 5338, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 10, Learns = 11, LastName = "Asom", Location = "Mostaganem" },
			new TextChatUser { Age = 24, Country =  123, FirstName = "Xenia",     Gender = "F", Id = 838, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Tedy", Location = "NULL" },
			new TextChatUser { Age = 32, Country =  216, FirstName = "Виктория",     Gender = "F", Id = 5383, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 6, LastName = "Сёмин", Location = "Almaty" },
			new TextChatUser { Age = 28, Country =  143, FirstName = "Deisy",     Gender = "F", Id = 839, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 2, Learns = 1, LastName = "Valaguera", Location = "Tunja" },
			new TextChatUser { Age = 35, Country =  123, FirstName = "Ирина",        Gender = "F", Id = 5397, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 6, LastName = "Хатламаджиян", Location = "Пермь" },
			new TextChatUser { Age = 20, Country =  123, FirstName = "Liza",      Gender = "F", Id = 840, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Sirotkina", Location = "Липецк" },
			new TextChatUser { Age = 49, Country =  146, FirstName = "Amalie",       Gender = "F", Id = 5473, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 26, Learns = 10, LastName = "Yalloy", Location = "Bergen" },
			new TextChatUser { Age = 23, Country =  123, FirstName = "Кирилл",    Gender = "M", Id = 841, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Лазаренко", Location = "Пенза" },
			new TextChatUser { Age = 21, Country =  113, FirstName = "Flávia Lecy",  Gender = "F", Id = 5477, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 9, Learns = 6, LastName = "Yudi", Location = "Santa Catarina" },
			new TextChatUser { Age = 30, Country =  205, FirstName = "Erkin",     Gender = "M", Id = 842, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Juraev", Location = "Qarshi" },
			new TextChatUser { Age = 31, Country =  121, FirstName = "Yen",          Gender = "F", Id = 5522, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 11, LastName = "Huang", Location = "NULL" },
			new TextChatUser { Age = 36, Country =  123, FirstName = "Оксана",    Gender = "F", Id = 843, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Кияненко", Location = "Санкт-Петербург" },



			//new TextChatUser { Age = 52, Country =  100, FirstName = "Vlam",      Gender = "F", Id = 1784, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 1, Learns = 11, LastName = "Vv", Location = "Florida" },
			//new TextChatUser { Age = 37, Country =  113, FirstName = "Leide",     Gender = "F", Id = 1785, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 9, Learns = 1, LastName = "Sykes", Location = "Nova Canaã" },
			//new TextChatUser { Age = 22, Country =  154, FirstName = "Brian",     Gender = "M", Id = 1786, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 2, Learns = 1, LastName = "Herrera", Location = "Graneros" },
			//new TextChatUser { Age = 22, Country =  143, FirstName = "Sebastian", Gender = "M", Id = 1787, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 2, Learns = 1, LastName = "Palacios", Location = "Bogota" },
			//new TextChatUser { Age = 21, Country =  113, FirstName = "Tainá",     Gender = "F", Id = 1788, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 9, Learns = 1, LastName = "Anjos", Location = "Porto Alegre" },
			//new TextChatUser { Age = 26, Country =  142, FirstName = "Alejandra", Gender = "F", Id = 1789, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 2, Learns = 11, LastName = "Luna", Location = "Arequipa" },
			//new TextChatUser { Age = 37, Country =  109, FirstName = "Sally",     Gender = "F", Id = 1790, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "Wang", Location = "北京" },
			//new TextChatUser { Age = 21, Country =  119, FirstName = "Cynthia",   Gender = "F", Id = 1791, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 2, Learns = 1, LastName = "Gro", Location = "México" },
			//new TextChatUser { Age = 27, Country =  255, FirstName = "Bolortuya", Gender = "F", Id = 1792, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 81, Learns = 1, LastName = "Amar", Location = "Ulaanbaatar" },
			//new TextChatUser { Age = 24, Country =  112, FirstName = "Gisele",    Gender = "F", Id = 1793, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 2, Learns = 1, LastName = "Hhts", Location = "La Plata" },
			//new TextChatUser { Age = 24, Country =  148, FirstName = "Joseph",    Gender = "M", Id = 1794, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 1, Learns = 2, LastName = "Doeteh", Location = "Accra" },
			//new TextChatUser { Age = 20, Country =  109, FirstName = "Sherry",    Gender = "F", Id = 1795, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "Liu", Location = "Bj" },
			//new TextChatUser { Age = 23, Country =  100, FirstName = "Selah",     Gender = "F", Id = 1796, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 1, Learns = 5, LastName = "R.", Location = "Tricities" },
			//new TextChatUser { Age = 24, Country =  119, FirstName = "Vicky",     Gender = "F", Id = 1797, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 2, Learns = 1, LastName = "Perez", Location = "Monterrey" },
			//new TextChatUser { Age = 30, Country =  123, FirstName = "Andrey",    Gender = "M", Id = 1798, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Khmarenkov", Location = "Kolomna" },
			//new TextChatUser { Age = 24, Country =  109, FirstName = "Jessie",    Gender = "F", Id = 1799, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "Yang", Location = "Qingdao" },
			//new TextChatUser { Age = 21, Country =  127, FirstName = "Elva",      Gender = "F", Id = 1800, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 11, Learns = 1, LastName = "Park", Location = "Seoul" },
			//new TextChatUser { Age = 39, Country =  111, FirstName = "Marianna",  Gender = "F", Id = 1801, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 6, Learns = 1, LastName = "Valenti", Location = "Bari" },
			//new TextChatUser { Age = 29, Country =  109, FirstName = "Yuyan",     Gender = "F", Id = 1802, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "L韩", Location = "Dongying" },
			//new TextChatUser { Age = 21, Country =  123, FirstName = "Илья",      Gender = "M", Id = 1803, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Виляева", Location = "Воронеж" },
			//new TextChatUser { Age = 46, Country =  202, FirstName = "Лариса",    Gender = "F", Id = 1804, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Петрова", Location = "Николаев" },
			//new TextChatUser { Age = 20, Country =  123, FirstName = "Emma",      Gender = "F", Id = 1805, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Kirdiushkina", Location = "NULL" },
			//new TextChatUser { Age = 24, Country =  151, FirstName = "Tuan",      Gender = "M", Id = 1806, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 27, Learns = 1, LastName = "Trần", Location = "Ho Chi Minh city" },
			//new TextChatUser { Age = 21, Country =  123, FirstName = "Nastya",    Gender = "F", Id = 1807, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Deynekin", Location = "Козьмодемьянск" },
			//new TextChatUser { Age = 27, Country =  122, FirstName = "Pook",      Gender = "F", Id = 1808, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 22, Learns = 1, LastName = "Noimatunn", Location = "Bkk" },
			//new TextChatUser { Age = 45, Country =  106, FirstName = "Gabriel",   Gender = "M", Id = 1809, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 2, Learns = 1, LastName = "Camelas", Location = "Barcelona" },
			//new TextChatUser { Age = 34, Country =  111, FirstName = "Gabriele",  Gender = "M", Id = 1810, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 6, Learns = 1, LastName = "Lezzi", Location = "Napoli" },
			//new TextChatUser { Age = 27, Country =  123, FirstName = "Max",       Gender = "M", Id = 1811, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Grechanichenko", Location = "Moscow" },
			//new TextChatUser { Age = 20, Country =  204, FirstName = "Aslan",     Gender = "M", Id = 1812, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Тарасов", Location = "Баку" },
			//new TextChatUser { Age = 39, Country =  105, FirstName = "Davood",    Gender = "M", Id = 1813, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 21, Learns = 1, LastName = "Mi", Location = "Brisbane" },
			//new TextChatUser { Age = 29, Country =  109, FirstName = "Liang",     Gender = "M", Id = 1814, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "何.", Location = "Zhengzhou" },
			//new TextChatUser { Age = 24, Country =  174, FirstName = "Stefan",    Gender = "M", Id = 1815, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 1, Learns = 56, LastName = "Kubik", Location = "Cadca" },
			//new TextChatUser { Age = 24, Country =  109, FirstName = "Mable",     Gender = "F", Id = 1816, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "Hao", Location = "珠海" },
			//new TextChatUser { Age = 21, Country =  116, FirstName = "Clarence",  Gender = "F", Id = 1817, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 14, Learns = 4, LastName = "Mauricio", Location = "Davao city" },
			//new TextChatUser { Age = 24, Country =  109, FirstName = "Summer",    Gender = "F", Id = 1818, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "Wu", Location = "Chengdu" },
			//new TextChatUser { Age = 25, Country =  113, FirstName = "Yago",      Gender = "M", Id = 1819, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 9, Learns = 1, LastName = "Segredo", Location = "Salvador" },
			//new TextChatUser { Age = 27, Country =  109, FirstName = "Ariel",     Gender = "F", Id = 1820, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "冀.", Location = "NULL" },
			//new TextChatUser { Age = 30, Country =  109, FirstName = "Kyle",      Gender = "M", Id = 1821, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "Sun", Location = "上海" },
			//new TextChatUser { Age = 29, Country =  107, FirstName = "Yuki",      Gender = "F", Id = 1822, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 4, Learns = 1, LastName = "Nag", Location = "NULL" },
			//new TextChatUser { Age = 33, Country =  123, FirstName = "Dmitriy",   Gender = "M", Id = 1823, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Maki", Location = "Москва" },
			//new TextChatUser { Age = 34, Country =  109, FirstName = "Emma",      Gender = "F", Id = 1824, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "Peng", Location = "Qingdao" },
			//new TextChatUser { Age = 34, Country =  155, FirstName = "Szabolcs",  Gender = "M", Id = 1825, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 36, Learns = 1, LastName = "Tóbel", Location = "Budapest" },
			//new TextChatUser { Age = 43, Country =  109, FirstName = "Shohe",     Gender = "M", Id = 1826, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 4, LastName = "Tan", Location = "西安" },
			//new TextChatUser { Age = 27, Country =  202, FirstName = "Viktor",    Gender = "M", Id = 1827, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Porada", Location = "Donetsk" },
			//new TextChatUser { Age = 22, Country =  109, FirstName = "Richard",   Gender = "F", Id = 1828, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "W.", Location = "Jiangsu" },
			//new TextChatUser { Age = 22, Country =  109, FirstName = "Zoei",      Gender = "F", Id = 1829, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "Ting", Location = "Shanghai" },
			//new TextChatUser { Age = 23, Country =  113, FirstName = "Jones",     Gender = "M", Id = 1830, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 9, Learns = 1, LastName = "Mendes", Location = "Sao paulo" },
			//new TextChatUser { Age = 20, Country =  199, FirstName = "Евгений",   Gender = "M", Id = 1831, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 5, LastName = "Tutu", Location = "Ивацевичи" },
			//new TextChatUser { Age = 31, Country =  142, FirstName = "Crystal",   Gender = "F", Id = 1832, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 2, Learns = 1, LastName = "Cotrina", Location = "Trujillo" },
			//new TextChatUser { Age = 41, Country =  252, FirstName = "Dana",      Gender = "F", Id = 1833, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 10, Learns = 1, LastName = "Vu", Location = "Aden" },
			//new TextChatUser { Age = 27, Country =  113, FirstName = "Andres",    Gender = "M", Id = 1834, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 9, Learns = 1, LastName = "Vaz Miranda", Location = "Rio de Janeiro" },
			//new TextChatUser { Age = 35, Country =  113, FirstName = "Jocelito",  Gender = "M", Id = 1835, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 9, Learns = 1, LastName = "Terra", Location = "Campo Largo - Pr" },
			//new TextChatUser { Age = 21, Country =  113, FirstName = "Clara",     Gender = "F", Id = 1836, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 9, Learns = 1, LastName = "César", Location = "São paulo" },
			//new TextChatUser { Age = 50, Country =  113, FirstName = "Jose",      Gender = "M", Id = 1837, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 9, Learns = 1, LastName = "Lima", Location = "Rio de janeiro" },
			//new TextChatUser { Age = 24, Country =  123, FirstName = "Xenia",     Gender = "F", Id = 1838, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Tedy", Location = "NULL" },
			//new TextChatUser { Age = 28, Country =  143, FirstName = "Deisy",     Gender = "F", Id = 1839, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 2, Learns = 1, LastName = "Valaguera", Location = "Tunja" },
			//new TextChatUser { Age = 20, Country =  123, FirstName = "Liza",      Gender = "F", Id = 1840, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Sirotkina", Location = "Липецк" },
			//new TextChatUser { Age = 23, Country =  123, FirstName = "Кирилл",    Gender = "M", Id = 1841, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Лазаренко", Location = "Пенза" },
			//new TextChatUser { Age = 30, Country =  205, FirstName = "Erkin",     Gender = "M", Id = 1842, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Juraev", Location = "Qarshi" },
			//new TextChatUser { Age = 36, Country =  123, FirstName = "Оксана",    Gender = "F", Id = 1843, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Кияненко", Location = "Санкт-Петербург" },

			//new TextChatUser { Age = 52, Country =  100, FirstName = "Vlam",      Gender = "F", Id = 2784, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 1, Learns = 11, LastName = "Vv", Location = "Florida" },
			//new TextChatUser { Age = 37, Country =  113, FirstName = "Leide",     Gender = "F", Id = 2785, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 9, Learns = 1, LastName = "Sykes", Location = "Nova Canaã" },
			//new TextChatUser { Age = 22, Country =  154, FirstName = "Brian",     Gender = "M", Id = 2786, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 2, Learns = 1, LastName = "Herrera", Location = "Graneros" },
			//new TextChatUser { Age = 22, Country =  143, FirstName = "Sebastian", Gender = "M", Id = 2787, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 2, Learns = 1, LastName = "Palacios", Location = "Bogota" },
			//new TextChatUser { Age = 21, Country =  113, FirstName = "Tainá",     Gender = "F", Id = 2788, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 9, Learns = 1, LastName = "Anjos", Location = "Porto Alegre" },
			//new TextChatUser { Age = 26, Country =  142, FirstName = "Alejandra", Gender = "F", Id = 2789, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 2, Learns = 11, LastName = "Luna", Location = "Arequipa" },
			//new TextChatUser { Age = 37, Country =  109, FirstName = "Sally",     Gender = "F", Id = 2790, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "Wang", Location = "北京" },
			//new TextChatUser { Age = 21, Country =  119, FirstName = "Cynthia",   Gender = "F", Id = 2791, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 2, Learns = 1, LastName = "Gro", Location = "México" },
			//new TextChatUser { Age = 27, Country =  255, FirstName = "Bolortuya", Gender = "F", Id = 2792, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 81, Learns = 1, LastName = "Amar", Location = "Ulaanbaatar" },
			//new TextChatUser { Age = 24, Country =  112, FirstName = "Gisele",    Gender = "F", Id = 2793, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 2, Learns = 1, LastName = "Hhts", Location = "La Plata" },
			//new TextChatUser { Age = 24, Country =  148, FirstName = "Joseph",    Gender = "M", Id = 2794, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 1, Learns = 2, LastName = "Doeteh", Location = "Accra" },
			//new TextChatUser { Age = 20, Country =  109, FirstName = "Sherry",    Gender = "F", Id = 2795, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "Liu", Location = "Bj" },
			//new TextChatUser { Age = 23, Country =  100, FirstName = "Selah",     Gender = "F", Id = 2796, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 1, Learns = 5, LastName = "R.", Location = "Tricities" },
			//new TextChatUser { Age = 24, Country =  119, FirstName = "Vicky",     Gender = "F", Id = 2797, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 2, Learns = 1, LastName = "Perez", Location = "Monterrey" },
			//new TextChatUser { Age = 30, Country =  123, FirstName = "Andrey",    Gender = "M", Id = 2798, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Khmarenkov", Location = "Kolomna" },
			//new TextChatUser { Age = 24, Country =  109, FirstName = "Jessie",    Gender = "F", Id = 2799, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "Yang", Location = "Qingdao" },
			//new TextChatUser { Age = 21, Country =  127, FirstName = "Elva",      Gender = "F", Id = 2800, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 11, Learns = 1, LastName = "Park", Location = "Seoul" },
			//new TextChatUser { Age = 39, Country =  111, FirstName = "Marianna",  Gender = "F", Id = 2801, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 6, Learns = 1, LastName = "Valenti", Location = "Bari" },
			//new TextChatUser { Age = 29, Country =  109, FirstName = "Yuyan",     Gender = "F", Id = 2802, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "L韩", Location = "Dongying" },
			//new TextChatUser { Age = 21, Country =  123, FirstName = "Илья",      Gender = "M", Id = 2803, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Виляева", Location = "Воронеж" },
			//new TextChatUser { Age = 46, Country =  202, FirstName = "Лариса",    Gender = "F", Id = 2804, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Петрова", Location = "Николаев" },
			//new TextChatUser { Age = 20, Country =  123, FirstName = "Emma",      Gender = "F", Id = 2805, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Kirdiushkina", Location = "NULL" },
			//new TextChatUser { Age = 24, Country =  151, FirstName = "Tuan",      Gender = "M", Id = 2806, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 27, Learns = 1, LastName = "Trần", Location = "Ho Chi Minh city" },
			//new TextChatUser { Age = 21, Country =  123, FirstName = "Nastya",    Gender = "F", Id = 2807, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Deynekin", Location = "Козьмодемьянск" },
			//new TextChatUser { Age = 27, Country =  122, FirstName = "Pook",      Gender = "F", Id = 2808, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 22, Learns = 1, LastName = "Noimatunn", Location = "Bkk" },
			//new TextChatUser { Age = 45, Country =  106, FirstName = "Gabriel",   Gender = "M", Id = 2809, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 2, Learns = 1, LastName = "Camelas", Location = "Barcelona" },
			//new TextChatUser { Age = 34, Country =  111, FirstName = "Gabriele",  Gender = "M", Id = 2810, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 6, Learns = 1, LastName = "Lezzi", Location = "Napoli" },
			//new TextChatUser { Age = 27, Country =  123, FirstName = "Max",       Gender = "M", Id = 2811, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Grechanichenko", Location = "Moscow" },
			//new TextChatUser { Age = 20, Country =  204, FirstName = "Aslan",     Gender = "M", Id = 2812, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Тарасов", Location = "Баку" },
			//new TextChatUser { Age = 39, Country =  105, FirstName = "Davood",    Gender = "M", Id = 2813, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 21, Learns = 1, LastName = "Mi", Location = "Brisbane" },
			//new TextChatUser { Age = 29, Country =  109, FirstName = "Liang",     Gender = "M", Id = 2814, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "何.", Location = "Zhengzhou" },
			//new TextChatUser { Age = 24, Country =  174, FirstName = "Stefan",    Gender = "M", Id = 2815, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 1, Learns = 56, LastName = "Kubik", Location = "Cadca" },
			//new TextChatUser { Age = 24, Country =  109, FirstName = "Mable",     Gender = "F", Id = 2816, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "Hao", Location = "珠海" },
			//new TextChatUser { Age = 21, Country =  116, FirstName = "Clarence",  Gender = "F", Id = 2817, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 14, Learns = 4, LastName = "Mauricio", Location = "Davao city" },
			//new TextChatUser { Age = 24, Country =  109, FirstName = "Summer",    Gender = "F", Id = 2818, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "Wu", Location = "Chengdu" },
			//new TextChatUser { Age = 25, Country =  113, FirstName = "Yago",      Gender = "M", Id = 2819, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 9, Learns = 1, LastName = "Segredo", Location = "Salvador" },
			//new TextChatUser { Age = 27, Country =  109, FirstName = "Ariel",     Gender = "F", Id = 2820, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "冀.", Location = "NULL" },
			//new TextChatUser { Age = 30, Country =  109, FirstName = "Kyle",      Gender = "M", Id = 2821, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "Sun", Location = "上海" },
			//new TextChatUser { Age = 29, Country =  107, FirstName = "Yuki",      Gender = "F", Id = 2822, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 4, Learns = 1, LastName = "Nag", Location = "NULL" },
			//new TextChatUser { Age = 33, Country =  123, FirstName = "Dmitriy",   Gender = "M", Id = 2823, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Maki", Location = "Москва" },
			//new TextChatUser { Age = 34, Country =  109, FirstName = "Emma",      Gender = "F", Id = 2824, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "Peng", Location = "Qingdao" },
			//new TextChatUser { Age = 34, Country =  155, FirstName = "Szabolcs",  Gender = "M", Id = 2825, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 36, Learns = 1, LastName = "Tóbel", Location = "Budapest" },
			//new TextChatUser { Age = 43, Country =  109, FirstName = "Shohe",     Gender = "M", Id = 2826, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 4, LastName = "Tan", Location = "西安" },
			//new TextChatUser { Age = 27, Country =  202, FirstName = "Viktor",    Gender = "M", Id = 2827, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Porada", Location = "Donetsk" },
			//new TextChatUser { Age = 22, Country =  109, FirstName = "Richard",   Gender = "F", Id = 2828, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "W.", Location = "Jiangsu" },
			//new TextChatUser { Age = 22, Country =  109, FirstName = "Zoei",      Gender = "F", Id = 2829, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "Ting", Location = "Shanghai" },
			//new TextChatUser { Age = 23, Country =  113, FirstName = "Jones",     Gender = "M", Id = 2830, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 9, Learns = 1, LastName = "Mendes", Location = "Sao paulo" },
			//new TextChatUser { Age = 20, Country =  199, FirstName = "Евгений",   Gender = "M", Id = 2831, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 5, LastName = "Tutu", Location = "Ивацевичи" },
			//new TextChatUser { Age = 31, Country =  142, FirstName = "Crystal",   Gender = "F", Id = 2832, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 2, Learns = 1, LastName = "Cotrina", Location = "Trujillo" },
			//new TextChatUser { Age = 41, Country =  252, FirstName = "Dana",      Gender = "F", Id = 2833, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 10, Learns = 1, LastName = "Vu", Location = "Aden" },
			//new TextChatUser { Age = 27, Country =  113, FirstName = "Andres",    Gender = "M", Id = 2834, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 9, Learns = 1, LastName = "Vaz Miranda", Location = "Rio de Janeiro" },
			//new TextChatUser { Age = 35, Country =  113, FirstName = "Jocelito",  Gender = "M", Id = 2835, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 9, Learns = 1, LastName = "Terra", Location = "Campo Largo - Pr" },
			//new TextChatUser { Age = 21, Country =  113, FirstName = "Clara",     Gender = "F", Id = 2836, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 9, Learns = 1, LastName = "César", Location = "São paulo" },
			//new TextChatUser { Age = 50, Country =  113, FirstName = "Jose",      Gender = "M", Id = 2837, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 9, Learns = 1, LastName = "Lima", Location = "Rio de janeiro" },
			//new TextChatUser { Age = 24, Country =  123, FirstName = "Xenia",     Gender = "F", Id = 2838, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Tedy", Location = "NULL" },
			//new TextChatUser { Age = 28, Country =  143, FirstName = "Deisy",     Gender = "F", Id = 2839, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 2, Learns = 1, LastName = "Valaguera", Location = "Tunja" },
			//new TextChatUser { Age = 20, Country =  123, FirstName = "Liza",      Gender = "F", Id = 2840, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Sirotkina", Location = "Липецк" },
			//new TextChatUser { Age = 23, Country =  123, FirstName = "Кирилл",    Gender = "M", Id = 2841, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Лазаренко", Location = "Пенза" },
			//new TextChatUser { Age = 30, Country =  205, FirstName = "Erkin",     Gender = "M", Id = 2842, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Juraev", Location = "Qarshi" },
			//new TextChatUser { Age = 36, Country =  123, FirstName = "Оксана",    Gender = "F", Id = 2843, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Кияненко", Location = "Санкт-Петербург" },

			//new TextChatUser { Age = 52, Country =  100, FirstName = "Vlam",      Gender = "F", Id = 3784, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 1, Learns = 11, LastName = "Vv", Location = "Florida" },
			//new TextChatUser { Age = 37, Country =  113, FirstName = "Leide",     Gender = "F", Id = 3785, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 9, Learns = 1, LastName = "Sykes", Location = "Nova Canaã" },
			//new TextChatUser { Age = 22, Country =  154, FirstName = "Brian",     Gender = "M", Id = 3786, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 2, Learns = 1, LastName = "Herrera", Location = "Graneros" },
			//new TextChatUser { Age = 22, Country =  143, FirstName = "Sebastian", Gender = "M", Id = 3787, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 2, Learns = 1, LastName = "Palacios", Location = "Bogota" },
			//new TextChatUser { Age = 21, Country =  113, FirstName = "Tainá",     Gender = "F", Id = 3788, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 9, Learns = 1, LastName = "Anjos", Location = "Porto Alegre" },
			//new TextChatUser { Age = 26, Country =  142, FirstName = "Alejandra", Gender = "F", Id = 3789, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 2, Learns = 11, LastName = "Luna", Location = "Arequipa" },
			//new TextChatUser { Age = 37, Country =  109, FirstName = "Sally",     Gender = "F", Id = 3790, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "Wang", Location = "北京" },
			//new TextChatUser { Age = 21, Country =  119, FirstName = "Cynthia",   Gender = "F", Id = 3791, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 2, Learns = 1, LastName = "Gro", Location = "México" },
			//new TextChatUser { Age = 27, Country =  255, FirstName = "Bolortuya", Gender = "F", Id = 3792, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 81, Learns = 1, LastName = "Amar", Location = "Ulaanbaatar" },
			//new TextChatUser { Age = 24, Country =  112, FirstName = "Gisele",    Gender = "F", Id = 3793, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 2, Learns = 1, LastName = "Hhts", Location = "La Plata" },
			//new TextChatUser { Age = 24, Country =  148, FirstName = "Joseph",    Gender = "M", Id = 3794, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 1, Learns = 2, LastName = "Doeteh", Location = "Accra" },
			//new TextChatUser { Age = 20, Country =  109, FirstName = "Sherry",    Gender = "F", Id = 3795, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "Liu", Location = "Bj" },
			//new TextChatUser { Age = 23, Country =  100, FirstName = "Selah",     Gender = "F", Id = 3796, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 1, Learns = 5, LastName = "R.", Location = "Tricities" },
			//new TextChatUser { Age = 24, Country =  119, FirstName = "Vicky",     Gender = "F", Id = 3797, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 2, Learns = 1, LastName = "Perez", Location = "Monterrey" },
			//new TextChatUser { Age = 30, Country =  123, FirstName = "Andrey",    Gender = "M", Id = 3798, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Khmarenkov", Location = "Kolomna" },
			//new TextChatUser { Age = 24, Country =  109, FirstName = "Jessie",    Gender = "F", Id = 3799, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "Yang", Location = "Qingdao" },
			//new TextChatUser { Age = 21, Country =  127, FirstName = "Elva",      Gender = "F", Id = 3800, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 11, Learns = 1, LastName = "Park", Location = "Seoul" },
			//new TextChatUser { Age = 39, Country =  111, FirstName = "Marianna",  Gender = "F", Id = 3801, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 6, Learns = 1, LastName = "Valenti", Location = "Bari" },
			//new TextChatUser { Age = 29, Country =  109, FirstName = "Yuyan",     Gender = "F", Id = 3802, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "L韩", Location = "Dongying" },
			//new TextChatUser { Age = 21, Country =  123, FirstName = "Илья",      Gender = "M", Id = 3803, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Виляева", Location = "Воронеж" },
			//new TextChatUser { Age = 46, Country =  202, FirstName = "Лариса",    Gender = "F", Id = 3804, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Петрова", Location = "Николаев" },
			//new TextChatUser { Age = 20, Country =  123, FirstName = "Emma",      Gender = "F", Id = 3805, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Kirdiushkina", Location = "NULL" },
			//new TextChatUser { Age = 24, Country =  151, FirstName = "Tuan",      Gender = "M", Id = 3806, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 27, Learns = 1, LastName = "Trần", Location = "Ho Chi Minh city" },
			//new TextChatUser { Age = 21, Country =  123, FirstName = "Nastya",    Gender = "F", Id = 3807, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Deynekin", Location = "Козьмодемьянск" },
			//new TextChatUser { Age = 27, Country =  122, FirstName = "Pook",      Gender = "F", Id = 3808, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 22, Learns = 1, LastName = "Noimatunn", Location = "Bkk" },
			//new TextChatUser { Age = 45, Country =  106, FirstName = "Gabriel",   Gender = "M", Id = 3809, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 2, Learns = 1, LastName = "Camelas", Location = "Barcelona" },
			//new TextChatUser { Age = 34, Country =  111, FirstName = "Gabriele",  Gender = "M", Id = 3810, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 6, Learns = 1, LastName = "Lezzi", Location = "Napoli" },
			//new TextChatUser { Age = 27, Country =  123, FirstName = "Max",       Gender = "M", Id = 3811, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Grechanichenko", Location = "Moscow" },
			//new TextChatUser { Age = 20, Country =  204, FirstName = "Aslan",     Gender = "M", Id = 3812, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Тарасов", Location = "Баку" },
			//new TextChatUser { Age = 39, Country =  105, FirstName = "Davood",    Gender = "M", Id = 3813, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 21, Learns = 1, LastName = "Mi", Location = "Brisbane" },
			//new TextChatUser { Age = 29, Country =  109, FirstName = "Liang",     Gender = "M", Id = 3814, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "何.", Location = "Zhengzhou" },
			//new TextChatUser { Age = 24, Country =  174, FirstName = "Stefan",    Gender = "M", Id = 3815, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 1, Learns = 56, LastName = "Kubik", Location = "Cadca" },
			//new TextChatUser { Age = 24, Country =  109, FirstName = "Mable",     Gender = "F", Id = 3816, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "Hao", Location = "珠海" },
			//new TextChatUser { Age = 21, Country =  116, FirstName = "Clarence",  Gender = "F", Id = 3817, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 14, Learns = 4, LastName = "Mauricio", Location = "Davao city" },
			//new TextChatUser { Age = 24, Country =  109, FirstName = "Summer",    Gender = "F", Id = 3818, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "Wu", Location = "Chengdu" },
			//new TextChatUser { Age = 25, Country =  113, FirstName = "Yago",      Gender = "M", Id = 3819, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 9, Learns = 1, LastName = "Segredo", Location = "Salvador" },
			//new TextChatUser { Age = 27, Country =  109, FirstName = "Ariel",     Gender = "F", Id = 3820, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "冀.", Location = "NULL" },
			//new TextChatUser { Age = 30, Country =  109, FirstName = "Kyle",      Gender = "M", Id = 3821, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "Sun", Location = "上海" },
			//new TextChatUser { Age = 29, Country =  107, FirstName = "Yuki",      Gender = "F", Id = 3822, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 4, Learns = 1, LastName = "Nag", Location = "NULL" },
			//new TextChatUser { Age = 33, Country =  123, FirstName = "Dmitriy",   Gender = "M", Id = 3823, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Maki", Location = "Москва" },
			//new TextChatUser { Age = 34, Country =  109, FirstName = "Emma",      Gender = "F", Id = 3824, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "Peng", Location = "Qingdao" },
			//new TextChatUser { Age = 34, Country =  155, FirstName = "Szabolcs",  Gender = "M", Id = 3825, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 36, Learns = 1, LastName = "Tóbel", Location = "Budapest" },
			//new TextChatUser { Age = 43, Country =  109, FirstName = "Shohe",     Gender = "M", Id = 3826, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 4, LastName = "Tan", Location = "西安" },
			//new TextChatUser { Age = 27, Country =  202, FirstName = "Viktor",    Gender = "M", Id = 3827, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Porada", Location = "Donetsk" },
			//new TextChatUser { Age = 22, Country =  109, FirstName = "Richard",   Gender = "F", Id = 3828, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "W.", Location = "Jiangsu" },
			//new TextChatUser { Age = 22, Country =  109, FirstName = "Zoei",      Gender = "F", Id = 3829, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 7, Learns = 1, LastName = "Ting", Location = "Shanghai" },
			//new TextChatUser { Age = 23, Country =  113, FirstName = "Jones",     Gender = "M", Id = 3830, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 9, Learns = 1, LastName = "Mendes", Location = "Sao paulo" },
			//new TextChatUser { Age = 20, Country =  199, FirstName = "Евгений",   Gender = "M", Id = 3831, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 5, LastName = "Tutu", Location = "Ивацевичи" },
			//new TextChatUser { Age = 31, Country =  142, FirstName = "Crystal",   Gender = "F", Id = 3832, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 2, Learns = 1, LastName = "Cotrina", Location = "Trujillo" },
			//new TextChatUser { Age = 41, Country =  252, FirstName = "Dana",      Gender = "F", Id = 3833, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 10, Learns = 1, LastName = "Vu", Location = "Aden" },
			//new TextChatUser { Age = 27, Country =  113, FirstName = "Andres",    Gender = "M", Id = 3834, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 9, Learns = 1, LastName = "Vaz Miranda", Location = "Rio de Janeiro" },
			//new TextChatUser { Age = 35, Country =  113, FirstName = "Jocelito",  Gender = "M", Id = 3835, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 9, Learns = 1, LastName = "Terra", Location = "Campo Largo - Pr" },
			//new TextChatUser { Age = 21, Country =  113, FirstName = "Clara",     Gender = "F", Id = 3836, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 9, Learns = 1, LastName = "César", Location = "São paulo" },
			//new TextChatUser { Age = 50, Country =  113, FirstName = "Jose",      Gender = "M", Id = 3837, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 9, Learns = 1, LastName = "Lima", Location = "Rio de janeiro" },
			//new TextChatUser { Age = 24, Country =  123, FirstName = "Xenia",     Gender = "F", Id = 3838, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Tedy", Location = "NULL" },
			//new TextChatUser { Age = 28, Country =  143, FirstName = "Deisy",     Gender = "F", Id = 3839, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 2, Learns = 1, LastName = "Valaguera", Location = "Tunja" },
			//new TextChatUser { Age = 20, Country =  123, FirstName = "Liza",      Gender = "F", Id = 3840, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Sirotkina", Location = "Липецк" },
			//new TextChatUser { Age = 23, Country =  123, FirstName = "Кирилл",    Gender = "M", Id = 3841, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Лазаренко", Location = "Пенза" },
			//new TextChatUser { Age = 30, Country =  205, FirstName = "Erkin",     Gender = "M", Id = 3842, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Juraev", Location = "Qarshi" },
			//new TextChatUser { Age = 36, Country =  123, FirstName = "Оксана",    Gender = "F", Id = 3843, IsNoPrivateChat = false, IsSharedTalkMember = false, Knows = 8, Learns = 1, LastName = "Кияненко", Location = "Санкт-Петербург" },

		};

		//========== Constructor ======================================================================================

		public TextChatHub() : this(TextChatHubCtrl.Instance) {}
		public TextChatHub(TextChatHubCtrl ctrl) { _hubCtrl = ctrl; }

		//========== Handle Clients Connecting/Disconnecting ======================================================================================

		public override async Task OnConnected()
		{
			// Send the list of chat users to this user
			var chatUsers = _hubCtrl.ChatCtrl.GetUsersExcept(LocalUserId);
			chatUsers.AddRange(_hubCtrl.ChatCtrl.GetUsersWhoJustLeft()); // Add users who just left
			chatUsers.AddRange(_fakeProdUsers.GetRange(DateTime.Now.Minute, Math.Max(0, 30 - chatUsers.Count))); // Add up to 30 fake users, when there are less than 30. Good for debugging and populating when activity is really low.
			_hubCtrl.Send(Context.ConnectionId, new AddInitialUsersInvoker(chatUsers));

			// Send the count of users in each room to this user
			var countOfUsers = _hubCtrl.ChatCtrl.GetCountsOfUsers();
			_hubCtrl.Send(Context.ConnectionId, new SetInitialCountOfUsersInvoker(countOfUsers));

			// Send the private chat status to the user
			var privateChatStatuses = _hubCtrl.ChatCtrl.GetPrivateChatStatuses(LocalUserId);
			_hubCtrl.Send(Context.ConnectionId, new AddPrivateChatStatusInvoker(privateChatStatuses));

			// Map SignalR Connection to User
			var alreadyConnected = _hubCtrl.UsersConnections.ContainsKey(LocalUserId);
			_hubCtrl.UsersConnections.Add(LocalUserId, Context.ConnectionId);

			// Join Chat, if not already done in another connection
			if (alreadyConnected)
				Log.SignalR(LogTag.ClientAlreadyConnected, new { Context.ConnectionId, LocalUserId }, Context);
			else {
				// Create chat user
				var chatUser = await PublicProfile(LocalUserId);
				
				// Join the chat
				_hubCtrl.ChatCtrl.JoinChat(LocalUserId, chatUser);
				Log.SignalR(LogTag.ClientConnected, new { Context.ConnectionId,LocalUserId }, Context);
            }

			await base.OnConnected();
		}

		public override async Task OnDisconnected(bool stopCalled) {
			if (stopCalled) Log.SignalR(LogTag.ClientClosedConnection, new { Context.ConnectionId }, Context);
			else Log.SignalRWarn(LogTag.ClientTimedOut, new {Context.ConnectionId}, Context);
			_hubCtrl.CleanConnection(Context.ConnectionId);
			await base.OnDisconnected(stopCalled);
		}

		public override Task OnReconnected() {
			if (ValidateClient()) Log.SignalR(LogTag.ClientReconnected, new {Context.ConnectionId}, Context);
			return base.OnReconnected();
		}

		//========== Method for Clients ======================================================================================

		public async Task PostChatEventTo(RoomId roomId, string @event, string data) { if (ValidateClient()) await PostTo(roomId, JsonConvert.SerializeObject(new { @event, data }), MessageVisibility.System); }
		public async Task SetTypingActivityIn(RoomId roomId) {       if (ValidateClient()) await _hubCtrl.ChatCtrl.SetTypingActivity(LocalUserId, roomId); }
		public void Ping(OrderId orderIdToAck) {                     if (ValidateClient()) Clients.Caller.Pong(_hubCtrl.Ping(Context.ConnectionId, orderIdToAck)); }
		public void RequestResend(OrderId[] orderIds) {              if (ValidateClient()) _hubCtrl.RequestResend(Context.ConnectionId, orderIds); }

		public void SetUserActive()
		{
			if (!ValidateClient()) return;
			_hubCtrl.ChatCtrl.SetLastActivity(LocalUserId);
		}

		public async Task JoinRoom(string roomId)
		{
			if (!ValidateClient()) return;

			// Update the text chat tracker
			var result = await TextChatTrackerManager.JoinRoom(await GetUser(LocalUserId), roomId);

			// Post notification of accepted request if the member joined a room he's invited too
			if (result.HasLogTag(LogTag.ChatRequestAccepted))
				await PostTo(roomId, JsonConvert.SerializeObject(new { chatRequestAccepted = LocalUserId }), true);

			// Post notification of chat request if the member joined a room that had no tracker
			if (result.HasLogTag(LogTag.ChatRequestAddedFromJoinRoom))
				await PostTo(roomId, JsonConvert.SerializeObject(new { chatRequest = LocalUserId }), true);

			var tuple = _hubCtrl.ChatCtrl.JoinRoom(LocalUserId, roomId);
			bool connectionAlreadyInRoom = _hubCtrl.RoomsConnections.GetConnections(roomId).Contains(new ConnectionId(Context.ConnectionId));
			if(connectionAlreadyInRoom==false) _hubCtrl.RoomsConnections.AddConnection(roomId, Context.ConnectionId);

			var roomUsers = tuple.Item1;
			var roomMessages = tuple.Item2;

			// Add TimeAgo Stamp to list of messages in private rooms.
			if (roomMessages.Count != 0 && (((RoomId) roomId).IsPrivate() || roomMessages.Last().When.AddMinutes(5) > DateTime.Now)) {
				var culture = CookieHelper.GetValue(CookieHelper.CookieNames.UiCulture, Context.RequestCookies);
				var timeAgo = roomMessages.Last().When.Humanize(false, null, new CultureInfo(culture));
				roomMessages.Add(new TextChatMessage { RoomId = roomId, Text = JsonConvert.SerializeObject(new {timeAgo}), Visibility = MessageVisibility.Everyone });
			}
			
			_hubCtrl.Send(Context.ConnectionId, new AddInitialUsersToInvoker(roomId, roomUsers));
			_hubCtrl.Send(Context.ConnectionId, new AddInitialMessagesInvoker(roomMessages));
		}

		public void LeaveRoom(string roomId)
		{
			if (!ValidateClient()) return;

			// Remove this user's connection to the room. Since a user can have multiple connection to a room,
			// this is different from the actual removal of the user from the room
			_hubCtrl.RoomsConnections.RemoveConnection(Context.ConnectionId, roomId);
			
			// Get all possible connectionIds for this user
			IEnumerable<ConnectionId> connectionIds = _hubCtrl.UsersConnections.GetFromKey(LocalUserId);

			// Remove the user from the room if he has no connection left to it
			if (!_hubCtrl.RoomsConnections.HasConnections(roomId, connectionIds))
				_hubCtrl.ChatCtrl.LeaveRoom(LocalUserId, roomId);
		}

		public async Task PostTo(RoomId roomId, string text) => await PostTo(roomId, text, false);
		public async Task PostTo(RoomId roomId, string text, MessageVisibility visibility) => await PostTo(roomId, text, false, visibility);
		public async Task PostTo(RoomId roomId, string text, bool nameless, MessageVisibility visibility = MessageVisibility.Everyone)
		{
			if (!ValidateClient()) return;

			// Get Needed Data
			var localUser = await GetLocalUser();
			var localDeviceTag = GetLocalDeviceTag();
			
			if (localDeviceTag == null)  {
				Log.SignalRWarn(LogTag.PostToFailedDueToMissingDeviceTag, Context);
				return;
			}

			// Create the chat message
			var msg = new TextChatMessage {
				RoomId = roomId, UserId = localUser.Id, DeviceTag = localDeviceTag,
				FirstName = nameless ? "": localUser.FirstName, LastName = nameless ? "" : localUser.LastName,
				Text = text, ConnectionId = Context.ConnectionId, Visibility = visibility
			};

			// Update the text chat tracker, when the user post an actual message(vs.the system posts a message)
			if (roomId.IsPrivate() && !nameless) {
				var result = await TextChatTrackerManager.PostTo(LocalUserId, roomId);
				Log.SignalRLogReports(result.Reports, Context);
			}

			// Post the message and log event reports
			await _hubCtrl.ChatCtrl.PostTo(localUser, msg);
		}

		public async Task RequestPrivateChat(UserId partnerId)
		{
			if (!ValidateClient()) return;

			// The Hub shouldn't be in charge of this. It should go through the controller
			ITextChatUser user = null; 
			if (_hubCtrl.ChatCtrl.ChatModel.HasUser(partnerId)) // because the user might have left in the meantime
				user = _hubCtrl.ChatCtrl.ChatModel.GetUser(partnerId);
			var listOfRooms = new ListOfUsersPublicRooms {
				UserId = partnerId,
				IsNoPrivateChat = user?.IsNoPrivateChat ?? false,
				RoomIds = user == null ? null : _hubCtrl.ChatCtrl.ChatModel.GetPublicRoomsFor(partnerId)
			};

			_hubCtrl.Send(Context.ConnectionId, new PrivateChatRequestResponse(listOfRooms));

			// Set chat tracker status
			var roomId = ChatModel.PrivateRoomIdFrom(LocalUserId, partnerId);
			var result = await TextChatTrackerManager.RequestPrivateChat(await GetUser(LocalUserId), roomId, partnerId);
			Log.SignalRLogReports(result.Reports, Context);
			
			// Propagate request
			if (result.Value) {
				await PostTo(roomId, JsonConvert.SerializeObject(new {chatRequest = LocalUserId}), true);
				Log.Info(LogTag.PrivateChatRequested, new { userId = partnerId });
			}

		}

		public async Task IgnoreChatInvite(UserId partnerId)
		{
			if (!ValidateClient()) return;

			var roomId = ChatModel.PrivateRoomIdFrom(LocalUserId, partnerId);
			var result = await TextChatTrackerManager.IgnorePrivateChat(LocalUserId, roomId, partnerId);
			Log.SignalRLogReports(result.Reports, Context);
			Log.Info(LogTag.PrivateChatIgnored, new { userId = partnerId });
		}

		public async Task MarkAllCaughtUp(UserId partnerId)
		{
			if (!ValidateClient()) return;

			var roomId = ChatModel.PrivateRoomIdFrom(LocalUserId, partnerId);
			var result = await TextChatTrackerManager.MarkAllCaughtUp(LocalUserId, roomId/*, partnerId*/);
			Log.SignalRLogReports(result.Reports, Context);
		}

		public async Task BlockPrivateChat(bool @bool)
		{
			if (!ValidateClient()) return;

			var user = _hubCtrl.ChatCtrl.ChatModel.GetUser(LocalUserId);
			user.IsNoPrivateChat = @bool;

			if (@bool) await new HellolingoEntities().TagUser(LocalUserId, UserTags.TextChatNoPrivateChat);
			else await new HellolingoEntities().UntagUser(LocalUserId, UserTags.TextChatNoPrivateChat);
		}

		public void CancelAudioCall(RoomId roomId) { if (ValidateClient()) _hubCtrl.ChatCtrl.CancelAudioCall(LocalUserId, roomId); }
		public void DeclineAudioCall(RoomId roomId, string reason) { if (ValidateClient()) _hubCtrl.ChatCtrl.DeclineAudioCall(roomId, reason, Context.ConnectionId); }
		public void HangoutAudioCall(RoomId roomId) { if (ValidateClient()) _hubCtrl.ChatCtrl.HangoutAudioCall(LocalUserId, roomId); }
		public void AudioCallConnected(RoomId roomId) { if (ValidateClient()) _hubCtrl.ChatCtrl.AudioCallConnected(LocalUserId, roomId); }

		public async Task RequestAudioCall(RoomId roomId) 
		{
			if (!ValidateClient()) return;
			_hubCtrl.ChatCtrl.RequestAudioCall(roomId, LocalUserId);
		}

		//========== Helpers ======================================================================================

		protected virtual async Task<User> GetUser(UserId userId) => await new HellolingoEntities().Users.AsNoTracking().Include(u => u.Status).FirstOrDefaultAsync(u => u.Id == userId);

		protected UserId LocalUserId => Context.User.Identity.GetClaims().Id;

		protected virtual async Task<User> GetLocalUser() {
			using (var db = new HellolingoEntities()) {
				var localUserId = LocalUserId;
				return await db.Users.AsNoTracking().Include(u => u.Status).FirstOrDefaultAsync(u => u.Id == localUserId);
			}
		}

		private DeviceTag GetLocalDeviceTag()
		{
			try {
				var deviceTagCookie = Context.RequestCookies[CookieHelper.CookieNames.DeviceTag];
				return Convert.ToInt64(deviceTagCookie.Value);
			} catch (Exception) {
				Log.SignalRWarn(LogTag.NecessaryCookiesMissingOrCorrupted, Context);
				return null;
			}
		}

		private bool ValidateClient()
		{
			if (_hubCtrl.UsersConnections.Values.Contains<ConnectionId>(Context.ConnectionId)) return true;
			Log.SignalR(LogTag.ForcingUnknownClientToReconnect, new {Context.ConnectionId}, Context);
			Clients.Caller.ResetClient();
			return false;
		}

		protected virtual async Task<TextChatUser> PublicProfile(UserId id) {
			TextChatUser profile;
			using(var db = new HellolingoEntities()) {
				User u = await db.Users.AsNoTracking().FirstOrDefaultAsync(user => user.Id == id);
				// Consider using a mapper instead of manually mapping things: https://www.nuget.org/packages/AutoMapper/ or https://www.nuget.org/packages/TinyMapper/
				profile = new TextChatUser {
					Id = u.Id,
					FirstName = u.FirstName, LastName = u.LastName,
					Country = u.CountryId, Location = u.Location,
					Gender = u.Gender, Age = AgeInYearsHelper.GetAgeFrom(u.BirthYear, u.BirthMonth),
					Knows = u.KnowsId, Knows2 = u.Knows2Id, Learns = u.LearnsId, Learns2 = u.Learns2Id, 
					IsNoPrivateChat = u.Tags.Any(t => t.Id == UserTags.TextChatNoPrivateChat)
				};
			}
			return profile;
		}

	}

	//========== Logging related classes ======================================================================================

	public class LoggingPipelineModule : HubPipelineModule {
		protected override void OnIncomingError(ExceptionContext exceptionContext, IHubIncomingInvokerContext invokerContext) {
			Log.SignalRError(exceptionContext, invokerContext);
			base.OnIncomingError(exceptionContext, invokerContext);
		}
		protected override bool OnBeforeIncoming(IHubIncomingInvokerContext context) {
			Log.SignalRIn(context);
			return base.OnBeforeIncoming(context);
		}

		// Disabled: Logging is better handled (more descriptive) within the hub itself
		//protected override bool OnBeforeOutgoing(IHubOutgoingInvokerContext context) {
		//	Log.SignalR(context);
		//	return base.OnBeforeOutgoing(context);
		//}
	}
}
