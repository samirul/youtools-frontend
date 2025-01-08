import * as React from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import {ChartData} from './ChartData';

export default function Chart({category_id}) {
    const{sentimentData_analysis, valueFormatter} = ChartData(category_id)
    const size = {
        width: 350,
        height: 150,
      };
      
      const data = {
        data: sentimentData_analysis,
        valueFormatter,
      };
      
  return (
    <PieChart
      series={[
        {
          arcLabel: (item) => `${item.value.toFixed(1)}%`,
          arcLabelMinAngle: 35,
          arcLabelRadius: '60%',
          getItemColor: (item) => item.color,
          ...data,
        },
      ]}
      sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          fontWeight: 'bold',
        },
      }}
      {...size}
    />
  );
}
