import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { Container, Owner, Loading, BackButton, IssuesList, PageActions, ReplaceState } from "./styles";
import { FaArrowLeft } from "react-icons/fa";
import octokit from "../../services/api";

export default function Repositorio(){

    const {repositorio} = useParams();

    const [repos, setRepos] = useState({});
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [state, setState] = useState([
        {state: 'all', label: 'Todas', active: true},
        {state: 'open', label: 'Abertas', active: false},
        {state: 'closed', label: 'Fechadas', active: false},
    ]);
    const [stateIndex, setStateIndex] = useState(0);

    useEffect(()=>{

        async function load() {
            const nomeRepo = decodeURIComponent(repositorio);
            const[owner, repo] = nomeRepo.split('/');

            const [repositorioData, issuesData] = await Promise.all([
                octokit.request('GET /repos/{owner}/{repo}', {
                    owner: owner,
                    repo: repo,
                }),
                octokit.request('GET /repos/{owner}/{repo}/issues', {
                    owner: owner,
                    repo: repo,
                    state: state.find(f=>f.active).state,
                    per_page: 5,
                })
            ]);
            setRepos(repositorioData.data);
            setIssues(issuesData.data);
            setLoading(false);
        }

        load();

    },[repositorio, state]);

    useEffect(()=>{

        async function loadIssue() {
            const nomeRepo = decodeURIComponent(repositorio);
            const [owner, repo] = nomeRepo.split('/');

            const response = await octokit.request('GET /repos/{owner}/{repo}/issues', {
                owner: owner,
                repo: repo,
                state: state[stateIndex].state,
                page,
                per_page: 5,
            });

            setIssues(response.data);
        }
        loadIssue();

    },[repositorio, page, state, stateIndex])

    function handlePage(action){
        setPage(action === 'back' ? page-1 : page+1)
    }
    
    function handleState(index){
        setStateIndex(index);
    }
    
    if(loading){
        return(
            <Loading>
                <h1>Carregando</h1>
            </Loading>
        )
    }

    return(
        <Container>
           <BackButton to="/">
                <FaArrowLeft color="#000" size={30}/>
            </BackButton> 
           <Owner>
                <img 
                src={repos.owner.avatar_url} 
                alt={repos.owner.login}
                />
                <h1>{repos.name}</h1>
                <p>{repos.description}</p>
           </Owner>

           <ReplaceState active={stateIndex}>
            {state.map((filter, index) => (
                <button type="button"
                key={filter.label}
                onClick={()=>{handleState(index)}}>
                    {filter.label}
                </button>
            ))}
           </ReplaceState>

           <IssuesList>
            {issues.map(issue=>(
                <li key={String(issue.id)}>
                    <img src={issue.user.avatar_url} alt={issue.user.login}/>

                    <div>
                        <strong>
                            <a href={issue.html_url}>{issue.title}</a>

                            {issue.labels.map(label => (
                                <span key={String(label.id)}>{label.name}</span>
                            ))}
                        </strong>
                        <p>{issue.user.login}</p>
                    </div>

                </li>
            ))}
           </IssuesList>
           <PageActions>
           <button 
           type="button" 
           onClick={()=>handlePage('back')}
           disabled={page<2}>
            Voltar
           </button>
           <button 
           type="button" 
           onClick={()=>handlePage('next')}>
            Proxima
           </button>
           </PageActions>
        </Container>
    )
}