			var countryPictures = [];
			var countriesData = [];
			var photoIndex;
			
			//build the text predictor
			(function pullCountryNames() {	
				var countryList = document.getElementById("countryList");
				var countriesNamesRequest = new XMLHttpRequest();
				
				countriesNamesRequest.open("get", 'http://raw.githubusercontent.com/mledoze/countries/master/countries.json', true);
				countriesNamesRequest.send();
				
				// push countries names data to the countryList to be fired when a user write a character in the input box 
				countriesNamesRequest.onload = function() {
					JSON.parse(this.responseText).forEach(function(countryItem) {
						var option = document.createElement("option");
						countryList.appendChild(option);
						option.value = countryItem.name.common;
						
						// make an array with the country's information to pull the information from it.
						countriesData.push({"Name" : countryItem.name.official, "common" : countryItem.name.common , "Curreny" : countryItem.currency , "Latitude" : countryItem.latlng[0] , "Longitude" : countryItem.latlng[1] ,
						"Area" : countryItem.area , "Region" : countryItem.region, "Capital" : countryItem.capital });
						
					});
				}
				
			})();
			
			// this function is fired when a user input a country name in the input box. And it maps the desired country name variable to helper functions in order to show the requested information.
			function getGithubCountryRepo(country) {
				if (country.length === 0) {
					return;
				}
				
				var maximum = 0;
				
				photoIndex = 0;
				
				// clear photoSet from last request's photos
				photoSet.innerHTML = "";
				next.innerHTML = "Present Photos";
				back.style.visibility = "hidden";
				
				var countryRequest = new XMLHttpRequest();		
								
				// clean the page incase there are content from the last request
				mapsAndNewsBlock.style.visibility = "hidden";
				
				howItWorks.style.visibility = "hidden";
				loader.style.visibility = "visible";
				back.onclick = function() {
				
					if (photoIndex > 5) {		
						photoIndex -= 10;
						maximum -=5;						
						renderFlickrPhotos(commonName, maximum);
					} else {
						back.style.visibility = "hidden";
					}	
					
				}
					
				// when a user click on the "next" button then the application present new five photos from flickr api.
				next.onclick = function() {
				
					// when pressing the next button for the first time change the innerText to "next"
					if (photoIndex < 5) {				
						next.innerText = "next";
					
					// if the application has shown already five photos then show "back" button
					} else {
						back.style.visibility = "visible";
					}
					
					if (maximum < countryPictures.length -5) {
						maximum += 5;
						renderFlickrPhotos(commonName, maximum);
					}
					
				}
				
				// Make calls to the helper functions to show the content on the screen
				for (var j = 0; j < countriesData.length; j++) { 
					var currentCountry = countriesData[j];
					
					// check if the country is available in the data
					if (country === currentCountry.common) {
						commonName = currentCountry.common;
						renderCountryInfoTable(currentCountry);
						getWeather(currentCountry.Latitude, currentCountry.Longitude);
						drawGoogleMap(currentCountry.Latitude, currentCountry.Longitude, currentCountry.Area);
						pullLatestNews(country);
						getFlickrPhotos(country);
						return;
					}	
					
				}				
					
				alert(country + " is not a country!");
			}
			
			function getWeather(latitude, longitude) {
				var makeWeatherRequest = new XMLHttpRequest();
				makeWeatherRequest.open("get", 'http://api.openweathermap.org/data/2.5/weather?lat=' + latitude +
				'&lon=' + longitude + '&appid=bd5bc1519755874543545ebe815796ba', true);
				makeWeatherRequest.send();
				makeWeatherRequest.onload = function() {
					weatherBox.innerHTML	= "Weather = " + (JSON.parse(this.responseText).main.temp - 273.15).toFixed(2) + "  Celsius" + "(" + JSON.parse(this.responseText).weather[0].description + ")" ;
				}
				
			}
			
			//make an array of the URLs of the requested country's pictures
			function getFlickrPhotos(country) {					
				var makeFlickrRequest = new XMLHttpRequest();
				makeFlickrRequest.open("get", 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key='+
				'	d25561a9209c49fa69fe6e813cb922fc&tags=' +country + '&extras=url_l&format=json&nojsoncallback=1', true);
				makeFlickrRequest.send();	
				makeFlickrRequest.onload = function() {
					
					// build an array of URLs free of undefined values
					countryPictures =  JSON.parse(this.responseText).photos.photo.filter(function(curentPhoto) {
						if(curentPhoto.url_l){
							return true;
						}
					}).map(function(curentPhoto) {
						var url = curentPhoto.url_l;
						return  url.substr(0, url.length - 5).concat("b").concat(url.substr(url.length - 4));
					});
				};
				
			}
			
			function renderFlickrPhotos(country, maximum) {	
				var photoSetIneerHtml = ""
				for (; photoIndex < maximum; photoIndex++){
					var photo = countryPictures[photoIndex];
					photoSetIneerHtml += '<a href=' +  photo + ' target=_blank><img src=' + photo + '></a>';
				}
				photoSet.innerHTML = photoSetIneerHtml;
			}
				
			// present the map in an img element on the screen
			function drawGoogleMap(latitude, longitude, area) {
				var googleStaticMap = document.getElementById("googleStaticMap");
				var zoom = 6;
				
				if (area > 5000000){
					zoom = 3;
				} else if (area > 1000000) {
					zoom = 4;
				}
				
				googleStaticMap.src = 'http://maps.googleapis.com/maps/api/staticmap?' + 'center=' + latitude + ',' + longitude +'&' +
				'zoom=' + zoom +'&size=600x500&maptype=roadmap&markers=color:green%7Clabel:G%7C' + latitude + ',' + longitude;
			}
		
			//pull latest news from guardian api and present it.
			function pullLatestNews(country, td) {
				var newsRequest = new XMLHttpRequest();
				newsList.innerHTML = "";
				newsRequest.open("get", "http://content.guardianapis.com/search?q=" + country + "&from-date=2016-01-01&api-key=f941d0d2-0ab3-419c-b9df-c1107595e92b", true);
				newsRequest.send();
				newsRequest.onload = function() {
					
					// check whether there is a available news about the requested country or not, if yes build a list of the lastes ten news atricles
					if(JSON.parse(this.responseText).response.status === "ok") {
						var news = "";
						JSON.parse(this.responseText).response.results.forEach(function(item, index) {
								news += '<li><a href='+ item.webUrl+'>'+ item.webTitle + '</a></li>'		
						});
						newsList.innerHTML = news;
					}
				}
				
				mapsAndNewsBlock.style.visibility = "visible";
				loader.style.visibility = "hidden";
			}
			
			function renderCountryInfoTable(countryInfo) {
				table.innerHTML = "";
				
				// Setting up the table using data from countryInfo Object
				for (var property in countryInfo) {
					var row = table.insertRow();
					var cell_1 = row.insertCell(0);
					var cell_2 = row.insertCell(1);
					cell_1.innerHTML = property;
					cell_2.innerHTML = countryInfo[property];
				}
				
			}