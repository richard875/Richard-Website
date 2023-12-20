import Icon from "../enums/icons";

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
import youtube from "../../static/images/logos/youtube.png";
import youtubeBlack from "../../static/images/logos/youtube-black.png";

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
    case Icon.Canary:
      return isDark ? canary : canaryBlack;
    case Icon.Chancery:
      return chancery;
    case Icon.Cie:
      return cie;
    case Icon.Nasdaq:
      return isDark ? nasdaq : nasdaqBlack;
    case Icon.Maily:
      return maily;
    case Icon.Neetcode:
      return neetcode;
    case Icon.Slik:
      return isDark ? slik : slikBlack;
    case Icon.NzGovt:
      return isDark ? nzGovt : nzGovtBlack;
    case Icon.Panopto:
      return isDark ? panopto : panoptoBlack;
    case Icon.Piston:
      return piston;
    case Icon.Qantas:
      return isDark ? qantas : qantasBlack;
    case Icon.Redbull:
      return redbull;
    case Icon.UoA:
      return uoa;
    case Icon.USYD:
      return isDark ? usyd : usydBlack;
    case Icon.Yourcar:
      return yourcar;
    case Icon.YouTube:
      return isDark ? youtube : youtubeBlack;
    case Icon.Angular:
      return angular;
    case Icon.AWS:
      return aws;
    case Icon.CSharp:
      return csharp;
    case Icon.Docker:
      return docker;
    case Icon.DotNet:
      return dotnet;
    case Icon.Go:
      return go;
    case Icon.GraphQL:
      return graphql;
    case Icon.Jenkins:
      return jenkins;
    case Icon.MongoDB:
      return mongodb;
    case Icon.PostgreSQL:
      return postgresql;
    case Icon.Python:
      return python;
    case Icon.React:
      return react;
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
    default:
      return Icon.Empty;
  }
};

export default iconPicker;
