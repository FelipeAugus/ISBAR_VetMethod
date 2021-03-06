var count = 0

function salvaRegistros() {
    const registros = {}
    
    $('.registro').each(function(i, obj) {
        // I
        const nome = obj.getElementsByClassName('nome')[0].innerText;
        const infos = obj.getElementsByClassName('infos')[0].innerText;
        // S
        const situacao = obj.getElementsByClassName('situacao-text')[0].value;
        // B
        const breveHistorico = obj.getElementsByClassName('breveHistorico-text')[0].value;
        // A
        const avaliacao = obj.getElementsByClassName('avaliacao-text')[0].value;
        // R
        const recomendacao = obj.getElementsByClassName('recomendacao-text')[0].value;

        // console.log(`I - ${nome}  ${infos}\nS - ${situacao}\nB - ${breveHistorico}\nA - ${avaliacao}\nR - ${recomendacao}`)
    
        registros[i] = {
            'nome': nome,
            'infos': infos,
            'situacao': situacao,
            'historico': breveHistorico,
            'avaliacao': avaliacao,
            'recomendacao': recomendacao
        }
    });
    

    localStorage.setItem('registros',  JSON.stringify(registros));
}

function carregaRegistros() {
    const regStr = localStorage.getItem('registros');
    const registros = JSON.parse(regStr);
    // console.log(registros);
    if(registros) preencheRegistros(registros);
}

function preencheRegistros(registros) {
    Object.keys(registros).forEach(key => {
        const registro = registros[key];
        addRegistro(registro.nome, registro.infos, registro.situacao, registro.historico, registro.avaliacao, registro.recomendacao);
    });
}

function limpaRegistros() {
    $('#registros').html(``);
}

function addRegistro(nome='', infos='', situacao='', breveHistorico='', avaliacao='', recomendacao='') {
    $('#registros').append(`
        <div id="registro-${count}" class="container mt-2 registro">
            <div>
                <br>
                <div class="float-end">
                    <button class="btn btn-dark" onclick="delRegistro(${count})">Deletar</button>
                </div>
                <h2 contenteditable="true" class="nome">${nome?nome:' --- Nome do animal --- '}</h2>
                
                <h4>Infos do fela</h3>
                <div class="float-end">
                    <button class="btn dropdown-toggle" onclick="toggle(${count})"></button>
                </div>
                <span contenteditable="true" class="infos">${infos?infos:'----- Informa????es do animal -----'}</span>
                <br><br>
            </div>
            <!-- Quando clica no BTN essa daqui varia dentre hidden ou n??o -->
            <div id="SBAR-${count}" class="infos" style="display: none;"> 
                <div>
                    <div class="mb-2 situacao">
                        <h4>Situa????o do Fela</h4>
                        <textarea class="form-control situacao-text" cols="50" rows="5" placeholder="Motivos por quais o paciente necessita de cuidados atualmente, de forma simplificada. Qual a principal preocupa????o com ele no momento?">${situacao}</textarea>
                    </div>
                    <div class="mb-2 breveHistorico">
                        <h4>Breve Hist??rico do Fela</h4>
                        <textarea class="form-control breveHistorico-text" cols="50" rows="5" placeholder="Dados relevantes da hist??ria cl??nica pr??via do paciente. Contexto em que ele passou por consulta e foi internado, doen??as cr??nicas anteriormente diagnosticadas, procedimentos importantes pelos quais o animal passou anteriormente.">${breveHistorico}</textarea>
                    </div>
                    <div class="mb-2 avaliacao">
                        <h4>Breve Avalia????o do Fela</h4>
                        <textarea class="form-control avaliacao-text" cols="50" rows="5" placeholder="Impress??o pessoal sobre o paciente e altera????es significativas no estado de sa??de que ocorreram no ??ltimo turno. Estrat??gias que foram necess??rias para assessor??-lo (por exemplo: Necessidade de soro glicosado, antiem??ticos, antit??rmicos, anticonvulsivantes, uso do tapete aquecido, oxigenioterapia etc.).">${avaliacao}</textarea>
                    </div>
                    <div class="mb-2 recomendacao">
                        <h4>Recomenda????es para o Fela</h4>
                        <textarea class="form-control recomendacao-text" cols="50" rows="5" placeholder="Sugest??es em geral. O que precisa ser feito para a continuidade do seu tratamento? Qual fator merece receber maior aten????o? Quais as recomenda????es em rela????o ?? alimenta????o do paciente? Sugest??es para manter o conforto do paciente? Sugest??es de exames a serem solicitados? Sugest??es de f??rmacos que devem ser acrescentados?">${recomendacao}</textarea>
                    </div>
                </div>
            </div>
        </div>
    `);
    count+=1;
}

function delRegistro(registro){
    $(`#registro-${registro}`).remove();
}

function exportarRegistros(){
    salvaRegistros();
    const registros = localStorage.getItem('registros');

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(registros);
    
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", `RegistrosISBAR_${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function importarRegistros(){
    const arquivoImportado = document.getElementById('import').files[0];

    if (arquivoImportado.type.match('.json')) {
        const fileReader = new FileReader();
        fileReader.onload = function (e) {
            const conteudoArquivo = JSON.parse(fileReader.result);
            console.log(conteudoArquivo);
            if(verificaArquivo(conteudoArquivo)){
                preencheRegistros(conteudoArquivo);
            } else {
                alert("Por favor, entre com um arquivo v??lido");        
            }
        }
        fileReader.readAsText(arquivoImportado);
    }
    else {
        alert("Por favor, entre com um arquivo v??lido");
    }

}

function verificaArquivo(arquivoImportado) {
    try {
        let ret = true;
        Object.keys(arquivoImportado).forEach(key => {
            const registro = arquivoImportado[key];
            if(registro.nome === undefined) {ret = false; return;}
            if(registro.infos === undefined) {ret = false; return;}
            if(registro.situacao === undefined) {ret = false; return;}
            if(registro.historico === undefined) {ret = false; return;}
            if(registro.avaliacao === undefined) {ret = false; return;}
            if(registro.recomendacao === undefined) {ret = false; return;}
        });
        return ret;
    } catch (error) {
        console.log(error);
        return false;
    }    
}

function toggle(infos) {
    $(`#SBAR-${infos}`).toggle();
}
