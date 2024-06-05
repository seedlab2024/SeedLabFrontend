import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'safeUrl'
})
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Component({
  selector: 'app-cursorutas',
  templateUrl: './cursorutas.component.html',
  styleUrls: ['./cursorutas.component.css']
})
export class CursorutasComponent implements OnInit {
  items = [
    {
      title: 'Nivel 1',
      subItems: ['Lección 1.1', 'Lección 1.2'],
      expanded: false
    },
    {
      title: 'Nivel 2',
      subItems: ['Lección 2.1', 'Lección 2.2'],
      expanded: false
    },
    {
      title: 'Nivel 3',
      subItems: ['Lección 3.1', 'Lección 3.2'],
      expanded: false
    },
  ];

  contentData = {
    'Lección 1.1': [
      { type: 'video', url: 'https://www.youtube.com/watch?v=laXc22YPGhg&list=PLZ2ovOgdI-kVtF2yQ2kiZetWWTmOQoUSG', progress: 0 },
      { type: 'pdf', url: '/assets/content/Introduccion_al_Metodo_de_Diferencias_Fi.pdf' },
      { type: 'image', url: '/assets/images/logo_bonito.jpg' },
      { type: 'text', content: 'Este es un texto de ejemplo para la lección 1.1 SOY DEICY JEJEN :)' },
     
    ],
    'Lección 1.2': [
      { type: 'video', url: 'https://youtu.be/fg9Ve1wUBpc?si=LjFBKuS_BI2Ga46R', progress: 0 },
      { type: 'form', fields: [{ label: 'Nombre', type: 'text' }, { label: 'Edad', type: 'number' }] }
    ],
    'Lección 2.1': [
      { type: 'text', content: 'Contenido de texto para la lección 2.1' },
      { type: 'pdf', url: 'assets/documents/document2_1.pdf' }
    ],
    'Lección 2.2': [
      { type: 'image', url: '/assets/images/logo_bonito.jpg' },
      { type: 'video', url: 'https://www.youtube.com/watch?v=X0LVIKRwWBs&list=PLZ2ovOgdI-kWDh3jDh-GvgToRlVfwIUFw', progress: 60 }
    ],
    'Lección 3.1': [
      { type: 'image', url: 'assets/images/image2_1.png' },
      { type: 'video', url: 'https://www.youtube.com/watch?v=X0LVIKRwWBs&list=PLZ2ovOgdI-kWDh3jDh-GvgToRlVfwIUFw', progress: 60 }
    ],
  };

  selectedContent = [];

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    // Inicializar el componente
  }

  extractVideoId(url: string): string {
    const regExp = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return (match && match[1]) ? match[1] : '';
  }

  getSafeVideoUrl(url: string): SafeResourceUrl {
    const videoId = this.extractVideoId(url);
    const embedUrl = `https://www.youtube.com/embed/${videoId}?controls=0&showinfo=0&rel=0&modestbranding=1`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  toggleItem(index: number) {
    this.items[index].expanded = !this.items[index].expanded;
  }

  selectSubItem(subItem: string) {
    this.selectedContent = this.contentData[subItem] || [];
    this.selectedContent.forEach(content => {
      if (content.type === 'image' || content.type === 'pdf') {
        this.loadFile(content);
      }
    });
  }

  loadFile(content: any) {
    if (content.type === 'image' || content.type === 'pdf') {
      this.http.get(content.url, { responseType: 'blob' }).subscribe(data => {
        let blob = new Blob([data], { type: content.type === 'pdf' ? 'application/pdf' : 'image/jpeg' });
        let url = URL.createObjectURL(blob);
        content.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      });
    }
  }
}
