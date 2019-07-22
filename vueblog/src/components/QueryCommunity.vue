<template>
<!--  <div-->
<!--    style="display: flex;height: 500px;width: 100%;align-items: center;justify-content: center;">-->
<!--    <chart ref="dschart" :options="polar" style="margin-top: 20px"></chart>-->
<!--  </div>-->
  <div id="app">
    <div class="p2">
      <div class="container">
        <input type="text" name="" id="" placeholder="请输入社区ID" v-model="commnityID"/>
        <input type="button" value="发现风险网络" @click="search_graph"/>
      </div>
    </div>
    <div id = "graph"></div>
  </div>
</template>

<style>
  #graph .tooltip {
    position: absolute;
    padding: 2px;
    text-align: left;
    font: 8px "Hiragino Sans GB", "华文细黑", "STHeiti", "微软雅黑", "Microsoft YaHei", SimHei, "Helvetica Neue", Helvetica, Arial, sans-serif !important;
    background: rgba(0, 0, 0, .87);
    color: #fff;
    height:auto;
    border: 0px;
    border-radius:2px;
    pointer-events: none;
  }

  #graph .tooltip hr {
    padding: 0;
    margin: 2px 0;
  }
</style>
<script>
  import ECharts from 'vue-echarts/components/ECharts.vue'
  // import 'echarts/lib/chart/line'
  // import 'echarts/lib/component/tooltip'
  //
  // import 'echarts/lib/component/polar'
  //
  // import 'echarts/lib/component/legend'
  // import 'echarts/lib/component/title'
  // import 'echarts/theme/dark'
  // import 'echarts/lib/chart/bar'

  import {getRequest} from '../utils/api'
  export default{
    // components: {
    //   'chart': ECharts
    // },
    mounted: function () {
      // var _this = this;
      // getRequest("/article/dataStatistics").then(resp=> {
      //   if (resp.status == 200) {
      //     _this.$refs.dschart.options.xAxis.data = resp.data.categories;
      //     _this.$refs.dschart.options.series[0].data = resp.data.ds;
      //   } else {
      //     _this.$message({type: 'error', message: '数据加载失败!'});
      //   }
      // }, resp=> {
      //   _this.$message({type: 'error', message: '数据加载失败!'});
      // });
    },
    methods: {
      showGraph:function(links) {
        var nodes = {};
        // console.log(links)

        links.forEach(function(link) {
          link.source = nodes[link.source.name] || (nodes[link.source.name] = link.source);
          link.target = nodes[link.target.name] || (nodes[link.target.name] = link.target);
        });
        // console.log(links)
        // console.log(nodes)

        var width = $("#graph").width(),
          height = $("#graph").height();

        // console.log(nodes)
        // console.log(links)
        width = 1500
        height = 960


        var tooltip = d3.select("#graph").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);


        var force = d3.layout.force()//layout将json格式转化为力学图可用的格式
          .nodes(d3.values(nodes))//设定节点数组
          .links(links)//设定连线数组
          .size([width, height])//作用域的大小
          .linkDistance(180)//连接线长度
          .charge(-1000)//顶点的电荷数。该参数决定是排斥还是吸引，数值越小越互相排斥
          .on("tick", tick)//指时间间隔，隔一段时间刷新一次画面
          .start();//开始转换

        var svg = d3.select("#graph").append("svg")
          .attr("width", width)
          .attr("height", height);

        svg.append("circle").attr("cx", 30).attr("cy", 30).attr("r", 20).style("fill","#f9f6c1");
        svg.append("text").attr("x",53).attr("y",35).attr({'font-size':10, 'fill':"black"}).text(":车");
        svg.append("circle").attr("cx", 120).attr("cy", 30).attr("r", 20).style("fill","#37f9ee");
        svg.append("text").attr("x",143).attr("y",35).attr({'font-size':10, 'fill':"black"}).text(":未被标记的人");
        svg.append("circle").attr("cx", 30).attr("cy", 100).attr("r", 20).style("fill",'#aaf919');
        svg.append("text").attr("x",53).attr("y",105).attr({'font-size':10, 'fill':"black"}).text(":案件");
        svg.append("circle").attr("cx", 120).attr("cy", 100).attr("r", 20).style("fill","black");
        svg.append("text").attr("x",143).attr("y",105).attr({'font-size':10, 'fill':"black"}).text(":涉嫌欺诈的人");


        //箭头
        var marker2 =
          svg.append("marker")
            .attr("id", "arrow2")
            //.attr("markerUnits","strokeWidth")//设置为strokeWidth箭头会随着线的粗细发生变化
            .attr("markerUnits","userSpaceOnUse")
            .attr("viewBox", "0 0 12 12")//坐标系的区域
            .attr("refX", 30)//箭头坐标
            .attr("refY", 6)
            .attr("markerWidth", 12)
            .attr("markerHeight", 12)
            .attr("orient", "auto")//绘制方向，可设定为：auto（自动确认方向）和 角度值
            .attr("stroke-width",4)//箭头宽度
            .append("path")
            .attr("d", "M2,2 L10,6 L2,10 L6,6 L2,2")//箭头的路径
            .attr('fill', '#f00');//箭头颜色

        //箭头
        var marker=
          svg.append("marker")
          //.attr("id", function(d) { return d; })
            .attr("id", "arrow")
            //.attr("markerUnits","strokeWidth")//设置为strokeWidth箭头会随着线的粗细发生变化
            .attr("markerUnits","userSpaceOnUse")
            .attr("viewBox", "0 -5 10 10")//坐标系的区域
            .attr("refX",32)//箭头坐标
            .attr("refY", -1)
            .attr("markerWidth", 12)//标识的大小
            .attr("markerHeight", 12)
            .attr("orient", "auto")//绘制方向，可设定为：auto（自动确认方向）和 角度值
            .attr("stroke-width",2)//箭头宽度
            .append("path")
            .attr("d", "M0,-5L10,0L0,5")//箭头的路径
            .attr('fill','#000000');//箭头颜色

        /* 将连接线设置为曲线
        var path = svg.append("g").selectAll("path")
            .data(force.links())
            .enter().append("path")
            .attr("class", function(d) { return "link " + d.type; })
            .style("stroke",function(d){
                //console.log(d);
               return "#A254A2";//连接线的颜色
            })
            .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });
        */

        //设置连接线
        var edges_line = svg.selectAll(".edgepath")
          .data(force.links())
          .enter()
          .append("path")
          .attr({
            'd': function(d) {return 'M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y},
            'class':'edgepath',
            //'fill-opacity':0,
            //'stroke-opacity':0,
            //'fill':'blue',
            //'stroke':'red',
            'id':function(d,i) {return 'edgepath'+i;}})
          .style("stroke",function(d){
            var lineColor;
            //根据关系的不同设置线条颜色
            // if(d.rela=="上位产品" || d.rela=="上游" || d.rela=="下位产品"){
            //     lineColor="#A254A2";
            // }else if(d.rela=="主营产品"){
            //     lineColor="#B43232";
            // }
            lineColor="#B43232"
            return lineColor;
          })
          .style("pointer-events", "none")
          .style("stroke-width",0.5)//线条粗细
          .attr("marker-end", "url(#arrow2)" );//根据箭头标记的id号标记箭头

        var edges_text = svg.append("g").selectAll(".edgelabel")
          .data(force.links())
          .enter()
          .append("text")
          .style("pointer-events", "none")
          //.attr("class","linetext")
          .attr({  'class':'edgelabel',
            'id':function(d,i){return 'edgepath'+i;},
            //'dx':80,
            //'dy':0,
            'font-size':10,
            'fill':'rgba(170,14,46,0.97)'
          });

        //设置线条上的文字
        edges_text.append('textPath')
          .attr('xlink:href',function(d,i) {return '#edgepath'+i})
          //.attr("text-anchor", "middle")
          .style("pointer-events", "none")
          //.text(function(d){return d.relation;});
          .attr('x',function(d) {
            var relas = d.relation.split(",");
            d3.select(this).text(function () {
              return '';
            });
            for(var i in relas){
              d3.select(this).append('tspan')
                .attr('x', 60)
                .attr('y', 0)
                .attr('dy', "1.1em")
                .text(function () {
                  return relas[i];
                });
            }
          })


        //圆圈
        var circle = svg.append("g").selectAll("circle")
          .data(force.nodes())//表示使用force.nodes数据
          .enter().append("circle")
          .style("fill",function(node){
            var color;//圆圈背景色
            // var link=links[node.index];
            if(node.labels=="车"){
              color="#f9f6c1";
            }
            else if(node.labels=="人"){
              color="#37f9ee";
            }
            else if(node.labels=="人_欺诈"){
              color= 'black';
            }
            else{
              color="#aaf919";
            }
            return color;
          })
          .style('stroke',function(node){
            var color;//圆圈线条的颜色
            color="#A254A2";
            return color;
          })
          .attr("r", function(node){
            if(node.labels == "案件" || node.labels == "案件_欺诈" || node.labels == "车" || node.labels == "人"){
              return 20;
            }
            return 40
          })//设置圆圈半径
          .on("click",function(node){
            //单击时让连接线加粗
            edges_line.style("stroke-width",function(line){
              if(line.source.name==node.name || line.target.name==node.name){
                return 2;
              }else{
                return 0.5;
              }
            });
            //d3.select(this).style('stroke-width',2);
          })
          .on("mouseover", function (d) {
            var node_info = ''
            if (d.labels == "人" || d.labels == "人_欺诈"){
              node_info += '详情：<hr/><hr/>'
              node_info += '姓名：'
              node_info += d.name
              node_info += '<hr/>'

              node_info += '电话：'
              node_info += d.phone
              node_info += '<hr/>'

              node_info += '身份证：'
              node_info += d.identifynumber
              node_info += '<hr/>'

              node_info += '是否欺诈：'
              node_info += d.flag
              node_info += '<hr/>'

              node_info += '所在风险社区：'
              node_info += d.partition
              node_info += '<br/>'
              node_info += '风险社区详情：'
              node_info += d.partition_details
              node_info += '<hr/>'

              node_info += '标签：'
              node_info += d.labels

            }
            if (d.labels == "案件_欺诈" || d.labels == '案件'){
              node_info += '详情：<hr/><hr/>'
              node_info += '报案号：'
              node_info += d.registno
              node_info += '<hr/>'

              node_info += '欺诈类型：'
              node_info += d.fraudtype
              node_info += '<hr/>'

              node_info += '被保险人：<br/>'
              node_info += '姓名：'
              node_info += d.insured
              node_info += '<br/>'
              node_info += '电话：'
              node_info += d.insuredphone
              node_info += '<br/>'
              node_info += '身份证：'
              node_info += d.insuredidentifynumber
              node_info += '<hr/>'

              node_info += '标的车驾驶员：<br/>'
              node_info += '姓名：'
              node_info += d.driver
              node_info += '<br/>'
              node_info += '电话：'
              node_info += d.driverphone
              node_info += '<hr/>'

              node_info += '报案人：<br/>'
              node_info += '姓名：'
              node_info += d.reportor
              node_info += '<br/>'
              node_info += '电话：'
              node_info += d.reportorphone
              node_info += '<hr/>'

              node_info += '案件联系人：<br/>'
              node_info += '姓名：'
              node_info += d.linker
              node_info += '<br/>'
              node_info += '电话：'
              node_info += d.linkerphone
              node_info += '<hr/>'

              node_info += '三者车联系人：<br/>'
              node_info += '姓名：'
              node_info += d.thirdpartylinker
              node_info += '<br/>'
              node_info += '电话：'
              node_info += d.thirdpartylinkerphone
              node_info += '<hr/>'

              node_info += '标的车车主：<br/>'
              node_info += '姓名：'
              node_info += d.carowner
              node_info += '<br/>'
              node_info += '电话：'
              node_info += d.carownerphone
              node_info += '<hr/>'

              node_info += '标的车：<br/>'
              node_info += '车牌号：'
              node_info += d.carno
              node_info += '<br/>'
              node_info += '车vinno：'
              node_info += d.carvinno
              node_info += '<hr/>'

              node_info += '三者车：<br/>'
              node_info += '车牌号：'
              node_info += d.carno
              node_info += '<hr/>'


              node_info += '修理厂：<br/>'
              node_info += '修理厂名称：'
              node_info += d.factory
              node_info += '<br/>'
              node_info += '修理厂代码：'
              node_info += d.factorycode
              node_info += '<hr/>'

              node_info += '报案时间：'
              node_info += d.reportdate
              node_info += '<hr/>'

              node_info += '事故时间：'
              node_info += d.accidentdate
              node_info += '<hr/>'

              node_info += '标签：'
              node_info += d.labels
            }
            if (d.labels == "车"){
              node_info += '详情：<hr/><hr/>'
              node_info += '车牌号：'
              node_info += d.carno
              node_info += '<hr/>'

              node_info += '车vinno：'
              node_info += d.vinno
              node_info += '<hr/>'

              node_info += '车主：'
              node_info += d.carowner
              node_info += '<hr/>'

              node_info += '所在风险社区：'
              node_info += d.partition
              node_info += '<br/>'
              node_info += '风险社区详情：'
              node_info += d.partition_details
              node_info += '<hr/>'

              node_info += '标签：'
              node_info += d.labels
            }
            if (node_info) {
              tooltip.transition()
                .duration(200)
                .style("opacity", .9);
              tooltip.html(node_info)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            }
          })
          .on("mouseout", function () {
            tooltip.transition()
              .duration(500)
              .style("opacity", 0);
          })
          .call(force.drag);//将当前选中的元素传到drag函数中，使顶点可以被拖动
        /*
         circle.append("text")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")//在圆圈内添加文字
        .text(function(d) {
            //console.log(d);
            return d.name;
        }); */

        //圆圈的提示文字
        /*
        circle.append("svg:title")
            .text(function(node) {
                // var link=links[node.index];
                // if(node.name==link.source.name && link.rela=="主营产品"){
                //     return "双击可查看详情"
                // }
                return "双击可查看详情"
            });*/
        /* 矩形
        var rect=svg.append("rect")
                 .attr({"x":100,"y":100,
                        "width":100,"height":50,
                        "rx":5,//水平圆角
                        "ry":10//竖直圆角
                     })
                  .style({
                     "stroke":"red",
                     "stroke-width":1,
                     "fill":"yellow"
        });*/
        var text = svg.append("g").selectAll("text")
          .data(force.nodes())
          //返回缺失元素的占位对象（placeholder），指向绑定的数据中比选定元素集多出的一部分元素。
          .enter()
          .append("text")
          .attr("dy", ".3em")
          .attr('font-size',8)
          .attr("text-anchor", "middle")//在圆圈中加上数据
          .style('fill',function(node){
            var color;//文字颜色
            if (node.flag =="fraud"){
              color="#f9fdff";
            }else{
              color="#000000";
            }
            return color;
          })
          //.attr('x',function(d){
          //     // console.log(d.name+"---"+ d.name.length);
          //     var re_en = /[a-zA-Z]+/g;
          //     //如果是全英文，不换行
          //     if(d.name.match(re_en)){
          //         d3.select(this).append('tspan')
          //             .attr('x',0)
          //             .attr('y',2)
          //             .text(function(){return d.name;});
          //     }
          //     //如果小于四个字符，不换行
          //     else if(d.name.length<=4){
          //         d3.select(this).append('tspan')
          //             .attr('x',0)
          //             .attr('y',2)
          //             .text(function(){return d.name;});
          //     }else{
          //         var top=d.name.substring(0,4);
          //         var bot=d.name.substring(4,d.name.length);
          //
          //         d3.select(this).text(function(){return '';});
          //
          //         d3.select(this).append('tspan')
          //             .attr('x',0)
          //             .attr('y',-7)
          //             .text(function(){return top;});
          //
          //         d3.select(this).append('tspan')
          //             .attr('x',0)
          //             .attr('y',10)
          //             .text(function(){return bot;});
          //     }
          //直接显示文字
          //.text(function(d) {
          //    return d.name;
          //});
          .attr('x',function(d) {
            if (d.labels == "案件_欺诈"){
              d3.select(this).append('tspan')
                .attr('x', 0)
                .attr('y', 2)
                .text(function () {
                  return '案件';
                });
            }
            else if (d.name.length <= 9) {
              d3.select(this).append('tspan')
                .attr('x', 0)
                .attr('y', 2)
                .text(function () {
                  return d.name;
                });
            } else {
              var top = d.name.substring(0, 9);
              var bot = d.name.substring(9, d.name.length);

              d3.select(this).text(function () {
                return '';
              });

              d3.select(this).append('tspan')
                .attr('x', 0)
                .attr('y', -7)
                .text(function () {
                  return top;
                });

              d3.select(this).append('tspan')
                .attr('x', 0)
                .attr('y', 10)
                .text(function () {
                  return bot;
                });
            }
          })

        /*  将文字显示在圆圈的外面
        var text2 = svg.append("g").selectAll("text")
             .data(force.links())
            //返回缺失元素的占位对象（placeholder），指向绑定的数据中比选定元素集多出的一部分元素。
            .enter()
            .append("text")
            .attr("x", 150)//设置文字坐标
            .attr("y", ".50em")
            .text(function(d) {
                //console.log(d);
                //return d.name;
                //return d.rela;
                console.log(d);
                return  '1111';
            });*/

        function tick() {
          //path.attr("d", linkArc);//连接线
          circle.attr("transform", transform1);//圆圈
          text.attr("transform", transform2);//顶点文字
          //edges_text.attr("transform", transform3);
          //text2.attr("d", linkArc);//连接线文字
          //console.log("text2...................");
          //console.log(text2);
          //edges_line.attr("x1",function(d){ return d.source.x; });
          //edges_line.attr("y1",function(d){ return d.source.y; });
          //edges_line.attr("x2",function(d){ return d.target.x; });
          //edges_line.attr("y2",function(d){ return d.target.y; });

          //edges_line.attr("x",function(d){ return (d.source.x + d.target.x) / 2 ; });
          //edges_line.attr("y",function(d){ return (d.source.y + d.target.y) / 2 ; });


          edges_line.attr('d', function(d) {
            var path='M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y;
            return path;
          });

          edges_text.attr('transform',function(d,i){
            if (d.target.x<d.source.x){
              bbox = this.getBBox();
              rx = bbox.x+bbox.width/2;
              ry = bbox.y+bbox.height/2;
              return 'rotate(180 '+rx+' '+ry+')';
            }
            else {
              return 'rotate(0)';
            }
          });
        }

        //设置连接线的坐标,使用椭圆弧路径段双向编码
        function linkArc(d) {
          //var dx = d.target.x - d.source.x,
          // dy = d.target.y - d.source.y,
          // dr = Math.sqrt(dx * dx + dy * dy);
          //return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
          //打点path格式是：Msource.x,source.yArr00,1target.x,target.y

          return 'M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y
        }
        //设置圆圈和文字的坐标
        function transform1(d) {
          return "translate(" + d.x + "," + d.y + ")";
        }
        function transform2(d) {
          return "translate(" + (d.x) + "," + d.y + ")";
        }

      },
      search_graph :function(){
        var self = this;
        $.ajax({
          url: '/community?communityid='+ self.commnityID,
          type: 'get',
          data: {},
          dataType: 'json'
        }).then(function (res) {
          self.links = res['group'];
          $("#graph").empty();
          self.showGraph(res['group']);
        }).fail(function () {
          console.log('失败');
        })
      }
    },
    data: {
      links:[],
      commnityID:[]
    },
    // data: function () {
    //   return {
    //     polar: {
    //       title: {
    //         text: ''
    //       },
    //       toolbox: {
    //         show: true,
    //         feature: {
    //           dataZoom: {
    //             yAxisIndex: 'none'
    //           },
    //           dataView: {
    //             readOnly: false
    //           },
    //           magicType: {
    //             type: ['line', 'bar']
    //           },
    //           restore: {},
    //           saveAsImage: {}
    //         }
    //       },
    //       tooltip: {},
    //       legend: {
    //         data: ['pv']
    //       },
    //       xAxis: {
    //         data: []
    //       },
    //       yAxis: {},
    //       series: [{
    //         name: 'pv',
    //         type: 'line',
    //         data: []
    //       }],
    //       animationDuration: 3000
    //     }
    //   }
    // }
  }
</script>
