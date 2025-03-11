import ReactECharts from 'echarts-for-react';
import React, { useState, useEffect } from 'react';

const EChart = ({frameScores}) => {
    const [scores, setScores] = useState({});
    
    useEffect(() => {
        console.log('frameScores changed:', frameScores);
        if (frameScores) {
            setScores(frameScores);
            console.log('scores updated:', frameScores);
        }
    }, [frameScores]);

    // 准备数据
    const xData = Object.keys(scores);
    const yData = Object.values(scores);

    const option = {
        title: {
            text: '动作质量评估分析',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                return `帧数: ${params[0].name}<br/>得分: ${params[0].value.toFixed(2)}`;
            }
        },
        xAxis: {
            type: 'category',
            name: '帧数',
            data: xData,
            axisLabel: {
                interval: Math.floor(xData.length / 10) // 自动计算合适的标签间隔
            }
        },
        yAxis: {
            type: 'value',
            name: '得分',
            min: 0,
            max: 100,
            axisLabel: {
                formatter: '{value}分'
            }
        },
        series: [{
            name: '动作评分',
            data: yData,
            type: 'line',
            smooth: true, // 使曲线更平滑
            lineStyle: {
                width: 2
            },
            itemStyle: {
                color: '#409EFF'
            },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0,
                        color: 'rgba(64,158,255,0.3)' // 渐变开始颜色
                    }, {
                        offset: 1,
                        color: 'rgba(64,158,255,0)' // 渐变结束颜色
                    }]
                }
            }
        }],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        }
    };

    return (
        <div className="video-process-chart">
            <ReactECharts 
                option={option} 
                style={{ height: '400px' }}
                opts={{ renderer: 'svg' }} // 使用 SVG 渲染以获得更好的性能
            />
        </div>
    );
}

export default EChart;
