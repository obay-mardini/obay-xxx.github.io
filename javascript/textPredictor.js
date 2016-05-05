			var countryPictures = [];
			var countriesData = [];
			var photoIndex;
			
			//build the text predictor
			(function pullCountryNames() {	
				var countryList = document.getElementById("countryList");
				var countriesNamesRequest = new XMLHttpRequest();
				
				countriesNamesRequest.open("get", 'http://raw.githubusercontent.com/mledoze/countries/master/countries.json', true);
				countriesNamesRequest.send();
				
				// push countries data to the countryList to be fired when a user write a character in the input box 
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
			
			
	