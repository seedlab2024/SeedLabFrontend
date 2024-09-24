import { Component } from '@angular/core';
import { User } from '../../../Modelos/user.model';
import { Router } from '@angular/router';
import * as echarts from 'echarts';
import { DashboardsService } from '../../../servicios/dashboard.service';




@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  token: string | null = null;
  user: User = null;
  id: number;
  currentRolId: number = null;
  totalUsuarios: any[] = [];
  totalSuperAdmin: any = {};
  totalOrientador: any = {};
  totalAliados: any = {};
  totalAsesores: any = {};
  totalEmprendedores: any = {};
  topAliados: any = {};
  pieChartOption: echarts.EChartsOption;
  doughnutChartOption: echarts.EChartsOption;
  pendientesFinalizadasLabels: string[] = ['Pendientes', 'Finalizadas', 'Sin Asignar', 'Asignadas'];
  pendientesFinalizadasData: { data: number[] }[] = [{ data: [0, 0, 0, 0] }];
  isLoading: boolean = false;

 

  constructor(
    private dashboardService: DashboardsService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.validateToken();
    this.getDatosDashboard();
    this.getDatosGenerosGrafica();
    this.loadChartData();
  };


  ngAfterViewInit() {
    this.getDatosDashboard();
    this.getDatosGenerosGrafica();
    this.loadChartData();
  }

  /* Valida el token del login */
  validateToken(): void {
    if (!this.token) {
      this.token = localStorage.getItem('token');
      let identityJSON = localStorage.getItem('identity');

      if (identityJSON) {
        let identity = JSON.parse(identityJSON);
        this.user = identity;
        this.id = this.user.id;
        this.currentRolId = this.user.id_rol;
        if (this.currentRolId != 3) {
          this.router.navigate(['home']);
        }
      }
    }
    if (!this.token) {
      this.router.navigate(['home']);
    }
  }

  getDatosDashboard(): void {
    this.isLoading = true;
    this.dashboardService.dashboardAdmin(this.token).subscribe(
      data => {
        this.totalUsuarios = data;
        this.totalSuperAdmin = data.usuarios.superadmin;
        this.totalOrientador = data.usuarios.orientador;
        this.totalAliados = data.usuarios.aliado;
        this.totalAsesores = data.usuarios.asesor;
        this.totalEmprendedores = data.usuarios.emprendedor;
        this.topAliados = data.topAliados.original;

        // Configuración para la gráfica de Top Aliados
        this.initEChartsBar();

        // Configuración para la gráfica de Asesorías
        this.pieChartOption = {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            top: '5%',
            left: 'center'
          },
          series: [
            {
              name: 'Asesorías',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10
              },
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: false,
                }
              },
              labelLine: {
                show: false
              },
              data: [
                { value: data.conteoAsesorias.original.asesoriasAsignadas, name: 'Asignadas' },
                { value: data.conteoAsesorias.original.asesoriasSinAsignar, name: 'Sin asignar' }
              ],
            }
          ]
        };

        // Inicializar el gráfico de Asesorías
        this.initEChartsPie();
      },
      error => {
        console.log(error);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  initEChartsBar(): void {
    const chartDom = document.getElementById('echarts-bar');
    if (chartDom) {
      const myChart = echarts.init(chartDom);
      const option = {
        title: {},
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['Top Aliados']
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: [
          {
            type: 'category',
            data: this.topAliados.map(aliado => aliado.nombre),
            axisLabel: {
              interval: 0, // Muestra todas las etiquetas
              rotate: 30,  // Rota las etiquetas para mejor legibilidad
              formatter: function (value: string) {
                return value.length > 10 ? value.substring(0, 10) + '...' : value;
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Top Aliados',
            type: 'bar',
            data: this.topAliados.map((aliado, index) => ({
              value: aliado.asesoria,
              itemStyle: {
                color: this.getColorForIndex(index)
              }
            })),
            label: {
              show: true,
              position: 'top',
              color: '#000',
              formatter: '{c}', // Muestra el valor de la barra
              fontSize: 12
            },
            markLine: {
              data: [{ type: 'average', name: 'Avg' }]
            },
            barGap: '10%' // Ajusta el espacio entre las barras
          }
        ]
      };

      myChart.setOption(option);
    } else {
      console.error('No se pudo encontrar el elemento con id "echarts-bar"');
    }
  }

  getColorForIndex(index: number): string {
    // Lista de colores que se asignarán a las barras
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#8A2BE2', '#00FA9A', '#FFD700', '#DC143C'];
    return colors[index % colors.length]; // Asigna un color a cada barra, y repite si hay más barras que colores
  }


  getDatosGenerosGrafica(): void {
    this.dashboardService.dashboardAdmin(this.token).subscribe(
      response => {
        const data = response.generosEmprendedores.original;
        
        const formattedData = data.map(item => ({
          value: Number(item.total), 
          name: item.genero
        }));

        this.doughnutChartOption = {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            top: '5%',
            left: 'center'
          },
          series: [
            {
              name: 'Géneros',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10
              },
              label: {
                show: true,
                position: 'outside'
              },
              emphasis: {
                label: {
                  show: false,
                }
              },
              labelLine: {
                show: false
              },
              data: formattedData
            }
          ]
        };

        // Inicializa el gráfico aquí después de obtener los datos
        this.initEChartsDoughnut();
      },
      error => {
        console.log(error);
      }
    );
  }

  initEChartsDoughnut(): void {
    const chartDom = document.getElementById('echarts-doughnut');
    if (chartDom) {
      const myChart = echarts.init(chartDom);
      myChart.setOption(this.doughnutChartOption);
    } else {
      console.error('No se pudo encontrar el elemento con id "echarts-doughnut"');
    }
  }

  loadChartData() {
    this.dashboardService.getDashboard(this.token, this.id).subscribe(
      data => {
        this.pendientesFinalizadasData[0].data = [
          data['Asesorias Pendientes'] || 0,
          data['Asesorias Finalizadas'] || 0,
          data['Asesorias Sin Asignar'] || 0,
          data['Asesorias Asignadas'] || 0
        ];

        // Inicializar la gráfica con los datos cargados
        this.initEChartsPie();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  initEChartsPie() {
    const chartDom = document.getElementById('echarts-pie');
    if (chartDom) {
      echarts.dispose(chartDom); // Destruye la instancia anterior si existe
      const myChart = echarts.init(chartDom);
      const option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: 'Asesorías',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: false,
              }
            },
            labelLine: {
              show: false
            },
            data: this.pendientesFinalizadasLabels.map((label, index) => ({
              value: this.pendientesFinalizadasData[0].data[index],
              name: label
            }))
          }
        ]
      };
      myChart.setOption(option);
    } else {
      console.error('No se pudo encontrar el elemento con id "echarts-pie"');
    }
  }


  
}
