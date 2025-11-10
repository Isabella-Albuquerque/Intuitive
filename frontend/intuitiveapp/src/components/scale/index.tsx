import React from 'react'
import { View, Text, TextStyle } from 'react-native'
import Svg, { Line, Polygon, Text as SvgText } from 'react-native-svg'
import { styles } from './styles'

type Props = {
    value: number
    label: string
    labelStyle?: TextStyle
    valueStyle?: TextStyle
}

export default function Scale({ value, label, labelStyle, valueStyle }: Props) {
    const width = 300
    const height = 60
    const numTicks = 10
    const horizontalPadding = 16
    const usableWidth = width - horizontalPadding * 2
    const pointerX = horizontalPadding + ((value - 1) / (numTicks - 1)) * usableWidth

    return (
        <View style={styles.container}>
            <Text style={labelStyle}>{label}</Text>
            <Text style={value === null || value === 0 ? styles.semDados : valueStyle}>
                {value === null || value === 0 ? 'Sem dados' : value.toFixed(1)}
            </Text>


            <Svg width={width} height={height}>
                <Line x1={horizontalPadding} y1={height / 2} x2={width - horizontalPadding} y2={height / 2} stroke="#ccc" strokeWidth={4} />

                {Array.from({ length: numTicks }, (_, i) => {
                    const x = horizontalPadding + (i / (numTicks - 1)) * usableWidth
                    return (
                        <React.Fragment key={i}>
                            <Line x1={x} y1={height / 2 - 10} x2={x} y2={height / 2 + 10} stroke="#888" strokeWidth={2} />
                            <SvgText x={x} y={height / 2 + 25} fontSize={12} fill="#000" textAnchor="middle">
                                {i + 1}
                            </SvgText>
                        </React.Fragment>
                    )
                })}

                <Polygon
                    points={`${pointerX},${height / 2} ${pointerX - 8},${height / 2 - 14} ${pointerX + 8},${height / 2 - 14}`}
                    fill="#2e6480"
                />
            </Svg>
        </View>
    )
}
    
