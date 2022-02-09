const dataFetch = async () => {
    const response = await fetch("https://cdn.jsdelivr.net/gh/apilayer/restcountries@3dc0fb110cd97bce9ddf27b3e8e1f7fbe115dc3c/src/main/resources/countriesV2.json");
    let data = await response.json();

    const populationLimit = 61954;



    data = data.filter(ele => ele.population >= populationLimit);
    const subData = [];

    data.forEach(ele => {
        const obj = {
            currencies : ele.currencies,
            population : ele.population,
            area : ele.area,
            latlng : ele.latlng,
            name : ele.name
        };
        subData.push(obj);
    });

    const currencyList = [];
    subData.forEach(ele => {
        ele.currencies.forEach(cur => {
            currencyList.push(cur.name);
        });

    });

    // console.log(currencyList.sort());

    const finalCurrencyList = {};

    currencyList.forEach(ele => {
        if(!finalCurrencyList[ele]){
            finalCurrencyList[ele] = 0;
        }
        finalCurrencyList[ele]++;

    });

    const currencyNameList = [];

    Object.entries(finalCurrencyList).forEach(ele => {
        if(ele[1] === 1 && ele[0] !== "[D]"){
            currencyNameList.push(ele[0]);
        }
    });


    let subData1 = [];
    currencyNameList.forEach(ele => {
        if(!subData1.includes(subData.filter(item => item.currencies.find(cur => cur.name === ele))[0]))
            subData1.push(subData.filter(item => item.currencies.find(cur => cur.name === ele))[0]);
        
    });

    function compare(a, b){
        if(a.population >= b.population) return 1;
        else return -1;
    }

    subData1 = subData1.sort(compare);
    // console.log(subData1);

    

    subData1.length = 20;

    // console.log(subData1);
    const finalData = subData1.map(item => item.latlng);
    

    const degreeToRadian = (degList) => {
        return degList.map(item => item * Math.PI / 180);
    };

    // The great circle distance or the orthodromic distance is the shortest distance between two points on a sphere (or the surface of Earth).


    const calculateDistance = (latLonA, latLonB) => {
        // convert latitude and longitude in degrees to radian
        const [latA, lonA] = degreeToRadian(latLonA);
        const [latB, lonB] = degreeToRadian(latLonB);

        // Haversine formula

        const diffLat = latB - latA;
        const diffLon = lonB - lonA;

        const a = Math.pow(Math.sin(diffLat / 2), 2)
                 + Math.cos(latA) * Math.cos(latB)
                 * Math.pow(Math.sin(diffLon / 2),2);

        const c = 2 * Math.asin(Math.sqrt(a));

        return (6371 * c);
    };

    let distanceAns = 0;

    for(let i = 0; i<finalData.length - 1; i++){
        for(let j = i+1; j<finalData.length; j++){
             const distance = Number(calculateDistance(finalData[i], finalData[j]).toFixed(2)); 
             distanceAns+=distance;
        }
    }

    console.log(distanceAns.toFixed(2));

    
};


dataFetch();