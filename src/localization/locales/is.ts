export const is = {
  common: {
    cancel: "Hætta við",
    retry: "Reyna aftur",
    previous: "Fyrri",
    next: "Næsta",
    noneSelected: "Ekkert valið",
    clearSelection: "Hreinsa val",
    closeModal: "Loka glugga",
    unassigned: "Óúthlutað",
    selectLanguage: "Velja tungumál",
  },
  bulkActions: {
    assign: "Úthluta",
    archive: "Setja í geymslu",
    delete: "Eyða",
    confirmAction: "Staðfesta {{action}}",
  },
  pagination: {
    loadingPage: "Hleð síðu {{page}}...",
    showingPageWithError:
      "Sýni síðu {{page}} (gat ekki hlaðið heildarfjölda síða, {{count}} {{items}})",
    showingPage: "Sýni síðu {{page}} af {{totalPages}} ({{count}} {{items}})",
    pageLoadingTotal: "Síða {{page}} (hleð heildarfjölda síða...)",
    pageTotalUnavailable: "Síða {{page}} (heildarfjöldi síða ekki tiltækur)",
    pageOfTotal: "Síða {{page}} af {{totalPages}}",
    selectedCount: "{{count}} valin",
    searchTasks: "Leita að verkefnum",
    searchUsers: "Leita að notendum",
  },
  columns: {
    id: "Auðkenni",
    task: "Verkefni",
    assignee: "Úthlutað til",
    due: "Skiladagur",
    name: "Nafn",
    email: "Netfang",
  },
  tasks: {
    title: "Verkefnatöfla með síðum",
    itemNounPlural: "verkefni",
    emptyState: "Engin verkefni fundust á þessari síðu.",
    deleteConfirmTitle: "Eyða {{count}} verkefni?",
    deleteConfirmDescription:
      "Þessi aðgerð fjarlægir valin verkefni varanlega og er ekki hægt að afturkalla.",
    deleteConfirmButton: "Eyða verkefnum",
    previewAndMore: "...og {{count}} í viðbót",
    failedArchive: "Mistókst að setja valin verkefni í geymslu",
    failedDelete: "Mistókst að eyða völdum verkefnum",
    failedAssign: "Mistókst að úthluta notanda á valin verkefni",
    failedFetch: "Mistókst að sækja síðu með verkefnum",
  },
  users: {
    title: "Notendatöfla með síðum",
    modalTitle: "Notendur",
    itemNounPlural: "notendur",
    emptyState: "Engir notendur fundust á þessari síðu.",
    failedFetch: "Mistókst að sækja síðu með notendum",
  },
  assignModal: {
    titleSingular: "Úthluta notanda á {{count}} verkefni",
    titlePlural: "Úthluta notanda á {{count}} verkefni",
    description: "Veldu notanda til að úthluta strax. Verkefni: {{tasks}}",
    andMore: " og {{count}} í viðbót",
  },
  a11y: {
    selectAllOnPage: "Velja öll {{items}} á þessari síðu",
    selectItem: "Velja {{label}}",
  },
};

export type LocaleShape = typeof is;
