// src/components/homePage/cardData.js
import { Routess } from "../../routes";
import summary from "../../assets/summary.png";
import moderation from "../../assets/moderation.png";
import textinsight from "../../assets/textinsight.png";
import translate from "../../assets/translate.png";
import qna from "../../assets/qna.png";
import monitoring from "../../assets/monitoring.png";
import { useTranslation } from "react-i18next";

const cardData = () => {
    const { t } = useTranslation();
    return [
        {
            route: Routess.Summary,
            icon: summary,
            title: t("summarize"),
            content: t("summarize-content")
        },
        {
            route: Routess.Translate,
            icon: translate,
            title:  t("translate"),
            content: t("translate-content")
        },
        {
            route: Routess.QndA,
            icon: qna,
            title: t("QndA"),
            content: t("q&a-content")
        },
        {
            route: Routess.TextInsight,
            icon: textinsight,
            title: t("text-insight"),
            content: t("textinsight-content")
        },
        // {
        //     route: Routess.moderation,
        //     icon:moderation,
        //     title: t("moderation"),
        //     content: t("content-moderation")
        // },
        {
            route: Routess.Monitoring,
            icon: monitoring,
            title: t("monitoring"),
            content:t("monitoring-content")
        },
    ];
};

export default cardData;
