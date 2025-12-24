import { getDniStats } from "@/actions/dni-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, Ticket, Mail, Phone, Calendar, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
  const stats = await getDniStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: "#0D7702" }}>
          Tableau de bord
        </h1>
        <p className="text-muted-foreground">
          Statistiques des participants au Dialogue National Intergénérationnel
        </p>
      </div>

      {/* Statistiques principales */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card style={{ borderTop: "3px solid #0D7702" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Users className="h-4 w-4" style={{ color: "#0D7702" }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: "#0D7702" }}>{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Participants inscrits
            </p>
          </CardContent>
        </Card>

        <Card style={{ borderTop: "3px solid #F13D06" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aujourd'hui</CardTitle>
            <Calendar className="h-4 w-4" style={{ color: "#F13D06" }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: "#F13D06" }}>{stats.today}</div>
            <p className="text-xs text-muted-foreground">
              Nouvelles réservations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques par statut */}
      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmés</CardTitle>
            <UserCheck className="h-4 w-4" style={{ color: "#0D7702" }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: "#0D7702" }}>{stats.byStatus.CONFIRMED}</div>
            <p className="text-xs text-muted-foreground">
              Statut: CONFIRMED
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques par catégorie */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card style={{ borderLeft: "3px solid #0D7702" }}>
          <CardHeader>
            <CardTitle className="text-sm font-medium" style={{ color: "#0D7702" }}>Par Catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {/* Jeunes / Formation */}
              <div className="flex justify-between items-center">
                <span className="text-sm">Élève</span>
                <span className="font-bold" style={{ color: "#0D7702" }}>{stats.byCategory.ELEVE}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Étudiant</span>
                <span className="font-bold" style={{ color: "#0D7702" }}>{stats.byCategory.ETUDIANT}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Stagiaire</span>
                <span className="font-bold" style={{ color: "#0D7702" }}>{stats.byCategory.STAGIAIRE}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Apprenti</span>
                <span className="font-bold" style={{ color: "#0D7702" }}>{stats.byCategory.APPRENTI}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Jeune professionnel</span>
                <span className="font-bold" style={{ color: "#0D7702" }}>{stats.byCategory.JEUNE_PROFESSIONNEL}</span>
              </div>

              {/* Actifs */}
              <div className="flex justify-between items-center">
                <span className="text-sm">Professionnel</span>
                <span className="font-bold" style={{ color: "#0D7702" }}>{stats.byCategory.PROFESSIONNEL}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Fonctionnaire</span>
                <span className="font-bold" style={{ color: "#0D7702" }}>{stats.byCategory.FONCTIONNAIRE}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Entrepreneur</span>
                <span className="font-bold" style={{ color: "#F13D06" }}>{stats.byCategory.ENTREPRENEUR}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Travailleur indépendant</span>
                <span className="font-bold" style={{ color: "#0D7702" }}>{stats.byCategory.INDEPENDANT}</span>
              </div>

              {/* Emploi */}
              <div className="flex justify-between items-center">
                <span className="text-sm">Sans emploi</span>
                <span className="font-bold" style={{ color: "#F13D06" }}>{stats.byCategory.SANS_EMPLOI}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Chômage</span>
                <span className="font-bold" style={{ color: "#F13D06" }}>{stats.byCategory.CHOMAGE}</span>
              </div>

              {/* Seniors */}
              <div className="flex justify-between items-center">
                <span className="text-sm">Retraité</span>
                <span className="font-bold" style={{ color: "#0D7702" }}>{stats.byCategory.RETRAITE}</span>
              </div>

              {/* Société civile & communauté */}
              <div className="flex justify-between items-center">
                <span className="text-sm">Acteur de la société civile</span>
                <span className="font-bold" style={{ color: "#0D7702" }}>{stats.byCategory.ACTEUR_SOCIETE_CIVILE}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Leader communautaire</span>
                <span className="font-bold" style={{ color: "#0D7702" }}>{stats.byCategory.LEADER_COMMUNAUTAIRE}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Leader traditionnel</span>
                <span className="font-bold" style={{ color: "#0D7702" }}>{stats.byCategory.LEADER_TRADITIONNEL}</span>
              </div>

              {/* Organisations & institutions */}
              <div className="flex justify-between items-center">
                <span className="text-sm">Organisation</span>
                <span className="font-bold" style={{ color: "#0D7702" }}>{stats.byCategory.ORGANISATION}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Institution</span>
                <span className="font-bold" style={{ color: "#0D7702" }}>{stats.byCategory.INSTITUTION}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">ONG</span>
                <span className="font-bold" style={{ color: "#0D7702" }}>{stats.byCategory.ONG}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Association</span>
                <span className="font-bold" style={{ color: "#0D7702" }}>{stats.byCategory.ASSOCIATION}</span>
              </div>

              {/* Médias & diaspora */}
              <div className="flex justify-between items-center">
                <span className="text-sm">Média</span>
                <span className="font-bold" style={{ color: "#0D7702" }}>{stats.byCategory.MEDIA}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Journaliste</span>
                <span className="font-bold" style={{ color: "#0D7702" }}>{stats.byCategory.JOURNALISTE}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Diaspora</span>
                <span className="font-bold" style={{ color: "#0D7702" }}>{stats.byCategory.DIASPORA}</span>
              </div>

              {/* Autre */}
              <div className="flex justify-between items-center">
                <span className="text-sm">Autre</span>
                <span className="font-bold" style={{ color: "#0D7702" }}>{stats.byCategory.AUTRE}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ borderLeft: "3px solid #F13D06" }}>
          <CardHeader>
            <CardTitle className="text-sm font-medium" style={{ color: "#F13D06" }}>Par Sexe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Masculin</span>
                <span className="font-bold" style={{ color: "#0D7702" }}>{stats.byGender.MASCULIN}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Féminin</span>
                <span className="font-bold" style={{ color: "#F13D06" }}>{stats.byGender.FEMININ}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Autre</span>
                <span className="font-bold" style={{ color: "#0D7702" }}>{stats.byGender.AUTRE}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Non renseigné</span>
                <span className="font-bold" style={{ color: "#F13D06" }}>{stats.byGender.NULL}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ borderLeft: "3px solid #0D7702" }}>
          <CardHeader>
            <CardTitle className="text-sm font-medium" style={{ color: "#0D7702" }}>Informations de contact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" style={{ color: "#0D7702" }} />
                  <span className="text-sm">Avec email</span>
                </div>
                <span className="font-bold" style={{ color: "#0D7702" }}>{stats.withEmail}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" style={{ color: "#F13D06" }} />
                  <span className="text-sm">Avec téléphone</span>
                </div>
                <span className="font-bold" style={{ color: "#F13D06" }}>{stats.withPhone}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

