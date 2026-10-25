import { useState } from 'react';
import Next from '../img/tech-logos/nextjs.svg';
import TypeScript from '../img/tech-logos/typescript.svg';
import Python from '../img/tech-logos/python.svg';
import FastAPI from '../img/tech-logos/fastapi.svg';
import LangChain from '../img/tech-logos/langchain.svg';
import DuckDB from '../img/tech-logos/duckdb.svg';
import Parquet from '../img/tech-logos/apacheparquet.svg';
import Java from '../img/tech-logos/java.svg';
import PostgreSQL from '../img/tech-logos/postgresql.svg';
import Zstandard from '../img/tech-logos/zstandard.png';
import Airflow from '../img/tech-logos/apacheairflow.svg';
import FastMCP from '../img/tech-logos/fastmcp.svg';
import PydanticAI from '../img/tech-logos/pydantic-ai.svg';
import Kubernetes from '../img/tech-logos/kubernetes.svg';
import Bitbucket from '../img/tech-logos/bitbucket.svg';

function Technology({ name, logo, monochrome = false }) {
  const [swapped, setSwapped] = useState(false);
  return <button type="button" className={`experience-tech-word${swapped ? ' is-swapped' : ''}`} aria-label={name}
    aria-pressed={swapped} title={name} onClick={() => setSwapped(value => !value)}>
    <span className="experience-tech-name">{name}</span>
    <span className="experience-tech-image" aria-hidden="true"><img src={logo} alt="" className={monochrome ? 'is-monochrome' : undefined} /></span>
  </button>;
}

export default function ExperienceTechStack({ company }) {
  if (company === 'Apple Inc') return <p className="timeline-experience-stack"><strong>Tech Stack:</strong>{' '}
    <Technology name="Python" logo={Python} />{', '}
    <Technology name="Airflow" logo={Airflow} />{', '}
    <Technology name="FastMCP" logo={FastMCP} />{', '}
    <Technology name="Pydantic AI" logo={PydanticAI} />{', '}
    <Technology name="Kubernetes" logo={Kubernetes} />{', '}
    <Technology name="Bitbucket API" logo={Bitbucket} />.
  </p>;
  return <p className="timeline-experience-stack"><strong>Tech Stack:</strong>{' '}
    <Technology name="Next.js" logo={Next} />{', '}
    <Technology name="TypeScript" logo={TypeScript} />{', '}
    <Technology name="Python" logo={Python} />{' ('}<Technology name="FastAPI" logo={FastAPI} />{', '}<Technology name="LangChain" logo={LangChain} monochrome />{'), '}
    <Technology name="DuckDB" logo={DuckDB} />{', '}
    <Technology name="Apache Parquet" logo={Parquet} monochrome />{', '}
    <Technology name="Java (WatchService)" logo={Java} />{', '}
    <Technology name="PostgreSQL" logo={PostgreSQL} />{', '}
    <Technology name="Zstandard" logo={Zstandard} />.
  </p>;
}
