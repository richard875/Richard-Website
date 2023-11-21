import canary from "../../static/images/logos/canary.svg";
import canaryBlack from "../../static/images/logos/canary-black.svg";
import chancery from "../../static/images/logos/chancery.png";
import cie from "../../static/images/logos/cie.png";
import nasdaq from "../../static/images/logos/nasdaq.svg";
import nasdaqBlack from "../../static/images/logos/nasdaq-black.svg";
import maily from "../../static/images/logos/maily.svg";
import neetcode from "../../static/images/logos/neetcode.svg";
import slik from "../../static/images/logos/slik.svg";
import slikBlack from "../../static/images/logos/slik-black.svg";
import nzGovt from "../../static/images/logos/nzgovt.png";
import nzGovtBlack from "../../static/images/logos/nzgovt-black.png";
import panopto from "../../static/images/logos/panopto.svg";
import panoptoBlack from "../../static/images/logos/panopto-black.svg";
import piston from "../../static/images/logos/piston.png";
import qantas from "../../static/images/logos/qantas.svg";
import qantasBlack from "../../static/images/logos/qantas-black.svg";
import redbull from "../../static/images/logos/redbull.svg";
import uoa from "../../static/images/logos/uoa.png";
import usyd from "../../static/images/logos/usyd.svg";
import usydBlack from "../../static/images/logos/usyd-black.svg";
import yourcar from "../../static/images/logos/yourcar.svg";
import youtube from "../../static/images/logos/youtube.svg";

import angular from "../../static/images/skills/angular.svg";
import aws from "../../static/images/skills/aws.svg";
import csharp from "../../static/images/skills/csharp.svg";
import docker from "../../static/images/skills/docker.svg";
import dotnet from "../../static/images/skills/dotnet.svg";
import go from "../../static/images/skills/go.svg";
import graphql from "../../static/images/skills/graphql.svg";
import jenkins from "../../static/images/skills/jenkins.svg";
import mongodb from "../../static/images/skills/mongodb.svg";
import postgresql from "../../static/images/skills/postgresql.svg";
import python from "../../static/images/skills/python.svg";
import react from "../../static/images/skills/react.svg";
import svelte from "../../static/images/skills/svelte.svg";
import swift from "../../static/images/skills/swift.svg";
import threejs from "../../static/images/skills/threejs.svg";
import threejsBlack from "../../static/images/skills/threejs-black.svg";
import typescript from "../../static/images/skills/typescript.svg";
import vue from "../../static/images/skills/vue.svg";

const iconPicker = (logo: string, isDark: boolean) => {
  switch (logo) {
    case "canary":
      return isDark ? canary : canaryBlack;
    case "chancery":
      return chancery;
    case "cie":
      return cie;
    case "nasdaq":
      return isDark ? nasdaq : nasdaqBlack;
    case "maily":
      return maily;
    case "neetcode":
      return neetcode;
    case "slik":
      return isDark ? slik : slikBlack;
    case "nzgovt":
      return isDark ? nzGovt : nzGovtBlack;
    case "panopto":
      return isDark ? panopto : panoptoBlack;
    case "piston":
      return piston;
    case "qantas":
      return isDark ? qantas : qantasBlack;
    case "redbull":
      return redbull;
    case "uoa":
      return uoa;
    case "usyd":
      return isDark ? usyd : usydBlack;
    case "yourcar":
      return yourcar;
    case "youtube":
      return youtube;
    case "angular":
      return angular;
    case "aws":
      return aws;
    case "csharp":
      return csharp;
    case "docker":
      return docker;
    case "dotnet":
      return dotnet;
    case "go":
      return go;
    case "graphql":
      return graphql;
    case "jenkins":
      return jenkins;
    case "mongodb":
      return mongodb;
    case "postgresql":
      return postgresql;
    case "python":
      return python;
    case "react":
      return react;
    case "svelte":
      return svelte;
    case "swift":
      return swift;
    case "threejs":
      return isDark ? threejs : threejsBlack;
    case "typescript":
      return typescript;
    case "vue":
      return vue;
    default:
      return "";
  }
};

export default iconPicker;
