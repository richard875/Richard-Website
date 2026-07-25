import Icon from "../enums/icons";

import canary from "../../static/images/logos/canary.svg";
import canaryBlack from "../../static/images/logos/canary-black.svg";
import chancery from "../../static/images/logos/chancery.svg";
import cie from "../../static/images/logos/cie.svg";
import coates from "../../static/images/logos/coates.svg";
import coatesBlack from "../../static/images/logos/coates-black.svg";
import fdjUnited from "../../static/images/logos/fdjunited.svg";
import fdjUnitedBlack from "../../static/images/logos/fdjunited-black.svg";
import maily from "../../static/images/logos/maily.svg";
import nasdaq from "../../static/images/logos/nasdaq.svg";
import nasdaqBlack from "../../static/images/logos/nasdaq-black.svg";
import neetcode from "../../static/images/logos/neetcode.svg";
import slik from "../../static/images/logos/slik.svg";
import slikBlack from "../../static/images/logos/slik-black.svg";
import nzGovt from "../../static/images/logos/nzgovt.png";
import nzGovtBlack from "../../static/images/logos/nzgovt-black.png";
import piston from "../../static/images/logos/piston.png";
import qantas from "../../static/images/logos/qantas.svg";
import qantasBlack from "../../static/images/logos/qantas-black.svg";
import redbull from "../../static/images/logos/redbull.svg";
import uoa from "../../static/images/logos/uoa.svg";
import uoaBlack from "../../static/images/logos/uoa-black.svg";
import usyd from "../../static/images/logos/usyd.svg";
import usydBlack from "../../static/images/logos/usyd-black.svg";
import yourcar from "../../static/images/logos/yourcar.svg";
import youtube from "../../static/images/logos/youtube.svg";
import youtubeBlack from "../../static/images/logos/youtube-black.svg";

import angular from "../../static/images/skills/angular.svg";
import aws from "../../static/images/skills/aws.svg";
import awsBlack from "../../static/images/skills/aws-black.svg";
import couchbase from "../../static/images/skills/couchbase.svg";
import csharp from "../../static/images/skills/csharp.svg";
import docker from "../../static/images/skills/docker.svg";
import dotnet from "../../static/images/skills/dotnet.svg";
import gitlab from "../../static/images/skills/gitlab.svg";
import go from "../../static/images/skills/go.svg";
import grafana from "../../static/images/skills/grafana.svg";
import graphql from "../../static/images/skills/graphql.svg";
import jenkins from "../../static/images/skills/jenkins.svg";
import kafka from "../../static/images/skills/kafka.svg";
import kafkaBlack from "../../static/images/skills/kafka-black.svg";
import kubernetes from "../../static/images/skills/kubernetes.svg";
import mongodb from "../../static/images/skills/mongodb.svg";
import mongodbBlack from "../../static/images/skills/mongodb-black.svg";
import postgresql from "../../static/images/skills/postgresql.svg";
import python from "../../static/images/skills/python.svg";
import react from "../../static/images/skills/react.svg";
import reactBlack from "../../static/images/skills/react-black.svg";
import sparkle from "../../static/images/skills/sparkle.svg";
import svelte from "../../static/images/skills/svelte.svg";
import swift from "../../static/images/skills/swift.svg";
import threejs from "../../static/images/skills/threejs.svg";
import threejsBlack from "../../static/images/skills/threejs-black.svg";
import typescript from "../../static/images/skills/typescript.svg";
import vue from "../../static/images/skills/vue.svg";

import chatgpt from "../../static/images/ai/chatgpt.svg";
import chatgptBlack from "../../static/images/ai/chatgpt-black.svg";
import claude from "../../static/images/ai/claude.svg";
import cursor from "../../static/images/ai/cursor.svg";
import cursorBlack from "../../static/images/ai/cursor-black.svg";
import gemini from "../../static/images/ai/gemini.svg";
import grok from "../../static/images/ai/grok.svg";
import grokBlack from "../../static/images/ai/grok-black.svg";
import huggingface from "../../static/images/ai/huggingface.svg";
import mcp from "../../static/images/ai/mcp.svg";
import mcpBlack from "../../static/images/ai/mcp-black.svg";
import metaai from "../../static/images/ai/metaai.svg";
import midjourney from "../../static/images/ai/midjourney.svg";
import midjourneyBlack from "../../static/images/ai/midjourney-black.svg";
import mistralai from "../../static/images/ai/mistralai.svg";
import ollama from "../../static/images/ai/ollama.svg";
import ollamaBlack from "../../static/images/ai/ollama-black.svg";
import openclaw from "../../static/images/ai/openclaw.svg";

const iconPicker = (logo: string, isDark: boolean) => {
  switch (logo) {
    case Icon.Canary:
      return isDark ? canary : canaryBlack;
    case Icon.Chancery:
      return chancery;
    case Icon.Cie:
      return cie;
    case Icon.Coates:
      return isDark ? coates : coatesBlack;
    case Icon.FdjUnited:
      return isDark ? fdjUnited : fdjUnitedBlack;
    case Icon.Maily:
      return maily;
    case Icon.Nasdaq:
      return isDark ? nasdaq : nasdaqBlack;
    case Icon.Neetcode:
      return neetcode;
    case Icon.Slik:
      return isDark ? slik : slikBlack;
    case Icon.NzGovt:
      return isDark ? nzGovt : nzGovtBlack;
    case Icon.Piston:
      return piston;
    case Icon.Qantas:
      return isDark ? qantas : qantasBlack;
    case Icon.Redbull:
      return redbull;
    case Icon.UoA:
      return isDark ? uoa : uoaBlack;
    case Icon.USYD:
      return isDark ? usyd : usydBlack;
    case Icon.Yourcar:
      return yourcar;
    case Icon.YouTube:
      return isDark ? youtube : youtubeBlack;
    // Skills
    case Icon.Angular:
      return angular;
    case Icon.AWS:
      return isDark ? aws : awsBlack;
    case Icon.Couchbase:
      return couchbase;
    case Icon.CSharp:
      return csharp;
    case Icon.Docker:
      return docker;
    case Icon.DotNet:
      return dotnet;
    case Icon.GitLab:
      return gitlab;
    case Icon.Go:
      return go;
    case Icon.Grafana:
      return grafana;
    case Icon.GraphQL:
      return graphql;
    case Icon.Jenkins:
      return jenkins;
    case Icon.Kafka:
      return isDark ? kafka : kafkaBlack;
    case Icon.Kubernetes:
      return kubernetes;
    case Icon.MongoDB:
      return isDark ? mongodb : mongodbBlack;
    case Icon.PostgreSQL:
      return postgresql;
    case Icon.Python:
      return python;
    case Icon.React:
      return isDark ? react : reactBlack;
    case Icon.Sparkle:
      return sparkle;
    case Icon.Svelte:
      return svelte;
    case Icon.Swift:
      return swift;
    case Icon.ThreeJS:
      return isDark ? threejs : threejsBlack;
    case Icon.TypeScript:
      return typescript;
    case Icon.Vue:
      return vue;
    // AI
    case Icon.ChatGPT:
      return isDark ? chatgpt : chatgptBlack;
    case Icon.Claude:
      return claude;
    case Icon.Cursor:
      return isDark ? cursor : cursorBlack;
    case Icon.Gemini:
      return gemini;
    case Icon.Grok:
      return isDark ? grok : grokBlack;
    case Icon.HuggingFace:
      return huggingface;
    case Icon.MCP:
      return isDark ? mcp : mcpBlack;
    case Icon.MetaAI:
      return metaai;
    case Icon.MidJourney:
      return isDark ? midjourney : midjourneyBlack;
    case Icon.MistralAI:
      return mistralai;
    case Icon.Ollama:
      return isDark ? ollama : ollamaBlack;
    case Icon.Openclaw:
      return openclaw;
    default:
      return Icon.Empty;
  }
};

export default iconPicker;
