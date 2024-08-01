import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Produto } from '../model/Produtos';
import { ProdutoService } from '../services/produto.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-produto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-produto.component.html',
  styleUrl: './form-produto.component.css'
})
export class FormProdutoComponent {

  //Vetor
  vetor:Produto[] = []

  //Objeto do Formulário
  //O formulario vai ter 3 caracteristicas valores numericos são definidos como null
  formulario = new FormGroup({
    id   : new FormControl(),
    nome : new FormControl(''),
    fabricante : new FormControl(''),//
    tipo : new FormControl(''),//
    quantidade : new FormControl(),//
    valor : new FormControl()
  })

  //Visibilidade dos botões
  btn:boolean = true

  //Construtor
  constructor(private servico:ProdutoService){

  }

  //Inicialização do componente
  //Essa função serve para iniciar algo assim que o componente for carregado no caso vai iniciar o selecionar
  ngOnInit(){
    this.selecionar();
  }

  //Método para selecionar todos os produtos
  selecionar(){
    this.servico.selecionar().subscribe(retorno => {this.vetor = retorno})

  }

  //Método para cadastrar produtos
  cadastrar(){
    this.servico.cadastrar(this.formulario.value as Produto)
    .subscribe(retorno => {

      this.vetor.push(retorno)

      this.formulario.reset()
    })
  }

//Método para selecionar produto
  selecionarProduto(indice:number){
    
    this.formulario.setValue({
      id   : this.vetor[indice].id,
      nome : this.vetor[indice].nome,
      fabricante : this.vetor[indice].fabricante,//
      tipo : this.vetor[indice].tipo,//
      quantidade : this.vetor[indice].quantidade,
      valor: this.vetor[indice].valor
    })

    this.btn = false //Deixando o botão cadastrar oculto e os demais visiveis
  }

  //Método para alterar produto
alterar(){
  this.servico.alterar(this.formulario.value as Produto)
  .subscribe(retorno => {

    //Obter o indice do objeto alterado
    let indiceAlterado = this.vetor.findIndex(obj =>{
      return this.formulario.value.id === obj.id
    })

    //Alterar o vetor
    this.vetor[indiceAlterado] = retorno

    //Limpar formulario
    this.formulario.reset()

    //Visibilidade dos botões
    this.btn = true
  })
}

//Método para remover produto
remover(){
  this.servico.remover(this.formulario.value.id)
  .subscribe(() =>{

    //Obter o indice do vetor que será removido
    let indiceRemovido = this.vetor.findIndex(obj => {
      return obj.id === this.formulario.value.id
    })

    //Remover objeto do vetor
    this.vetor.splice(indiceRemovido, 1)//A partir da posição do indice removido eu excluo um registro

    //Limpar Formulário
    this.formulario.reset()

    //Visibilidade dos botões
    this.btn = true

  })
}
}

