window.onload = function () {
  var app = new Vue({
    el: "#app",
    data: {
      trackers: [],
      selectedTracker: null,
      trackingData: [],
      filteredTrackingData: []
    },
    methods: {
      loadTrackers: async function () {
        try {
          let data = await request('GET', '/api/v1/trackers');
          this.trackers = data.trackers;
          this.trackers.unshift({url: 'Show All'});
          this.selectedTracker = 'Show All';
        }
        catch (error) {
          alert(error.error.message);
        }
      },
      loadTrackingData: async function () {
        try {
          let data = await request('GET', '/api/v1/trackers/data');
          data.forEach(item => {
            item.time = new Date(item.time);
          });
          this.trackingData = data.sort((item1, item2) => item2.time - item1.time);
          this.buildFilteredTrackingData();
        }
        catch (error) {
          alert(error.error.message);
        }
      },
      onTrackerChange(event) {
        this.buildFilteredTrackingData();
      },
      buildFilteredTrackingData(){
        if (this.selectedTracker === 'Show All') {
          this.filteredTrackingData = this.trackingData;
        }
        else {
          this.filteredTrackingData = this.trackingData.filter(item => {
            return item.url === this.selectedTracker;
          });
        }
      }
    }
  });
  app.loadTrackers();
  app.loadTrackingData();
};

async function request(method, url = '', data = {}) {
  // Default options are marked with *
  let options = {
    method, // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer' // no-referrer, *client
  };
  if (method !== 'GET') {
    options.body = JSON.stringify(data); // body data type must match "Content-Type" header
  }
  const response = await fetch(url, options);
  if (response.status >= 200 && response.status < 300) {
    return await response.json(); // parses JSON response into native JavaScript objects
  }
  throw await response.json();
}