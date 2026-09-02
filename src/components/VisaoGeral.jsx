import React from 'react'
import Ecommerce from './Ecommerce'
import InsideSales from './InsideSales'

/**
 * A Visão Geral usa o mesmo conjunto de componentes das visões
 * especializadas, escolhendo o layout conforme o tipo de negócio
 * do cliente selecionado.
 */
export default function VisaoGeral(props) {
  return props.cliente.tipo === 'ecommerce'
    ? <Ecommerce {...props} />
    : <InsideSales {...props} />
}
