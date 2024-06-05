import { Component, AfterViewInit, PLATFORM_ID, Inject, HostListener, OnInit, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TraeraliadosfanpageService } from '../../servicios/traeraliadosfanpage.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


// Importar función para registrar elementos personalizados de Swiper
import { register } from 'swiper/element/bundle';
// Registrar elementos personalizados de Swiper
register();
import Swiper from 'swiper';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']  // Corrige la propiedad de estilo a 'styleUrls'
})
export class BodyComponent implements OnInit, OnDestroy, AfterViewInit {

  cardSeleccionada: any;
  dir: any;
  videoUrl: any;
  resizedCardImage: string | undefined;
  currentIndex = 0;
  intervalId: any;
  slidesPerView = 5; // Por defecto, mostramos 4 imágenes
  totalSlides = 0; // Inicializar totalSlides a 0
  transitionEnabled = true;
  cards: any[] = []; // Añadir propiedad para almacenar los datos obtenidos

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private traeraliadosfanpageService: TraeraliadosfanpageService,
    private sanitizer: DomSanitizer // Inyecta el servicio
  ) {
    this.cardSeleccionada = {}; // Inicializar cardSeleccionada
  }

  ngOnInit(): void {
    this.traeraliadosfanpageService.getaliados().subscribe(data => {
      console.log(data); // Mostrar por consola los datos recibidos
      this.cards = data;
      this.totalSlides = this.cards.length;
      this.cardSeleccionada = this.cards[0]; // Inicializar con la primera imagen
      this.updateSlidesPerView();
      this.startAutoSlide();
      this.mostrarCard(0); // Mostrar la primera card al cargar
    });
  }



  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Aquí podrías inicializar cualquier cosa específica del navegador
    }
  }

    ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  
  extractVideoId(url: string): string {
    const regExp = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return (match && match[1]) ? match[1] : '';
  }


  get currentTransform(): number {
    return -this.currentIndex * (100 / this.slidesPerView);
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex > 0) ? this.currentIndex - 1 : 0;
    
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex < this.totalSlides - this.slidesPerView) ? this.currentIndex + 1 : 0;
  }

  startAutoSlide(): void {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 3000); // Cambia cada 3 segundos
  }

  stopAutoSlide(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.updateSlidesPerView();
  }

  updateSlidesPerView(): void {
    const width = window.innerWidth;
    if (width >= 1440) {
      this.slidesPerView = 5; // Pantallas grandes
    }else if (width >= 1024) {
      this.slidesPerView = 4; // Pantallas medianas
    } else if (width >= 768) {
      this.slidesPerView = 3; // Pantallas medianas
    } else if (width >= 640) {
      this.slidesPerView = 2; // Pantallas pequeñas
    } else {
      this.slidesPerView = 1; // Pantallas móviles
    }
    this.currentIndex = 0;
  }

  mostrarCard(index: number): void {
    this.cardSeleccionada = this.cards[index];
    this.resizeImage(this.cardSeleccionada.logo).then(resizedImage => {
      this.resizedCardImage = resizedImage;
    }).catch(error => {
      console.error('Error al redimensionar la imagen:', error);
    });
    if (this.cardSeleccionada.tipo_dato === 'Video') {
      let url = this.cardSeleccionada.ruta_multi;
      let videoId = this.extractVideoId(url);
      let embedUrl = `https://www.youtube.com/embed/${videoId}`;
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    }
    else if(this.cardSeleccionada.tipo_dato === 'Imagen'){
      let path = this.cardSeleccionada.ruta_multi;
      this.dir =  `../../../assets/images/${path}`
    }
    else{
      this.dir = this.cardSeleccionada.logo;
    }
  }

  private resizeImage(base64Image: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (ctx) {
          canvas.width = 317;
          canvas.height = 150;
          ctx.drawImage(img, 0, 0, 317, 150);
          const resizedImage = canvas.toDataURL('image/png');
          resolve(resizedImage);
        } else {
          reject(new Error('No se pudo obtener el contexto del canvas.'));
        }
      };
      img.onerror = (error) => reject(error);
      img.src = base64Image;
    });
  }

}
