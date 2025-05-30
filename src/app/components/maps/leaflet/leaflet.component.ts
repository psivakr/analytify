import { Component } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { SharedModule } from '../../../shared/sharedmodule';
@Component({
  selector: 'app-leaflet',
  standalone:true,
  imports:[SharedModule,LeafletModule,HttpClientModule],
  templateUrl: './leaflet.component.html',
  styleUrls: ['./leaflet.component.scss']
})
export class LeafletComponent {
  constructor(
    private http: HttpClient
  ) { }
  map!: L.Map;
  json : any;
  //Basic Map
  options1 = {
    layers: [
      L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: ""
      })
    ],
    zoom: 5,
    center: L.latLng(20.5937, 78.9629)
  };
  //Popup map
  options2 = {
    layers: [
      L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: ""
      }),
      L.circleMarker([20.5937, 78.9629]).bindPopup("<b>Hello world!<\/b><br />I am a popup.").openPopup()
    ],
    zoom: 5,
    center: L.latLng(20.5937, 78.9629)
  };
  //Circle map
  options3 = {
    layers: [
      L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 10,
        attribution: ""
      }),
      L.circle([20.5937, 78.9629], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 100
      })
    ],
    zoom: 5,
    center: L.latLng(20.5937, 78.9629)
  };

  onMapReady(map: L.Map) {
    this.http.get("assets/maps/leafletmap.json").subscribe((json: any) => {
      console.log(json);
      this.json = json;
      L.geoJSON(this.json).addTo(map);
    });
  }
  markerIcon = {
    icon: L.icon({
      iconSize: [25, 41],
      iconAnchor: [10, 41],
      popupAnchor: [2, -40],
      // specify the path here
      iconUrl: "assets/img/marker-icon.png",
      shadowUrl: "assets/img/marker-shadow.png"
    })
  };

  ngOnInit(): void {
  }

}
