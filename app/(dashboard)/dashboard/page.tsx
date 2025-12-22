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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
              Nouvelles inscriptions
            </p>
          </CardContent>
        </Card>

        <Card style={{ borderTop: "3px solid #0D7702" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cette semaine</CardTitle>
            <TrendingUp className="h-4 w-4" style={{ color: "#0D7702" }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: "#0D7702" }}>{stats.thisWeek}</div>
            <p className="text-xs text-muted-foreground">
              Inscriptions cette semaine
            </p>
          </CardContent>
        </Card>

        <Card style={{ borderTop: "3px solid #F13D06" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ce mois</CardTitle>
            <Calendar className="h-4 w-4" style={{ color: "#F13D06" }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: "#F13D06" }}>{stats.thisMonth}</div>
            <p className="text-xs text-muted-foreground">
              Inscriptions ce mois
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques par statut */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Ticket className="h-4 w-4" style={{ color: "#F13D06" }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: "#F13D06" }}>{stats.byStatus.PENDING}</div>
            <p className="text-xs text-muted-foreground">
              Statut: PENDING
            </p>
          </CardContent>
        </Card>

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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annulés</CardTitle>
            <UserX className="h-4 w-4" style={{ color: "#F13D06" }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: "#F13D06" }}>{stats.byStatus.CANCELLED}</div>
            <p className="text-xs text-muted-foreground">
              Statut: CANCELLED
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Présents</CardTitle>
            <UserCheck className="h-4 w-4" style={{ color: "#0D7702" }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.byStatus.CHECKED_IN}</div>
            <p className="text-xs text-muted-foreground">
              Statut: CHECKED_IN
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
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Professionnel</span>
                <span className="font-bold" style={{ color: "#0D7702" }}>{stats.byCategory.PROFESSIONNEL}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Étudiant</span>
                <span className="font-bold" style={{ color: "#0D7702" }}>{stats.byCategory.ETUDIANT}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Au chômage</span>
                <span className="font-bold" style={{ color: "#F13D06" }}>{stats.byCategory.CHOMAGE}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Retraité</span>
                <span className="font-bold" style={{ color: "#0D7702" }}>{stats.byCategory.RETRAITE}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Entrepreneur</span>
                <span className="font-bold" style={{ color: "#F13D06" }}>{stats.byCategory.ENTREPRENEUR}</span>
              </div>
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

