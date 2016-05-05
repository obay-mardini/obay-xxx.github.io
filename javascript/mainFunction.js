// this function is fired when a user input a country name in the input box. And it maps the desired country name variable to helper functions in order to show the requested information.
			function getGithubCountryRepo(country) {
				if (country.length === 0) {
					return;
				}
				
				var maximum = 0;
				photoIndex = 0;
				
				// clear photoSet components from last request's photos
				photoSet.innerHTML = "";
				next.innerHTML = "Present Photos";
				back.style.visibility = "hidden";
				
				var countryRequest = new XMLHttpRequest();		
								
				// clean the page incase there is content from the last request
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
				
				// Make calls to helper functions to show the content on the screen
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