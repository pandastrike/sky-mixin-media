import {collect, where, empty, cat, compact, intersection, first, project, isFunction, lift, bind} from "fairmont"
import {root, regularlyQualify} from "./url"

liftService = (s) ->
  service = {}
  for k, v of s
    service[k] = if isFunction v then lift bind v, s else v
  service


ACM = (AWS) ->
  acm = liftService new AWS.ACM region: "us-east-1"

  wild = (name) -> regularlyQualify "*." + root name
  apex = (name) -> regularlyQualify root name
  # This code was adapted from a larger chunk of Haiku.  We shouldn't ever need an apex hostname for this mixin in its current form.
  needsApex = -> false

  list = (current=[], token) ->
    params = CertificateStatuses: [ "ISSUED" ]
    params.NextToken = token if token
    {CertificateSummaryList, NextToken} = await acm.listCertificates params
    current = cat current, CertificateSummaryList

    if NextToken
      await list current, NextToken
    else
      current

  # Looks through many certs looking for a given domain as the primary.
  get = (name, list) -> collect where {DomainName: name}, list
  wildGet = (name, list) -> get wild(name), list
  apexGet = (name, list) -> get apex(name), list

  # Looks within an individual cert for its coverage of a given domain.
  scan = (name, CertificateArn) ->
    {Certificate} =  await acm.describeCertificate {CertificateArn}
    alternates = Certificate.SubjectAlternativeNames
    if name in alternates then CertificateArn else undefined

  multiScan = (name, list) ->
    arns = (await scan name, cert.CertificateArn for cert in list)
    collect compact arns

  wildScan = (name, list) -> await multiScan wild(name), list
  apexScan = (name, list) -> await multiScan apex(name), list

  containsWild = (name, list) ->
    wildArns = collect project "CertificateArn", wildGet(name, list)
    certs = apexGet name, list
    cat wildArns, await wildScan(name, certs)

  containsApex = (name, list) ->
    apexArns = collect project "CertificateArn", apexGet(name, list)
    certs = wildGet name, list
    cat apexArns, await apexScan(name, certs)

  hasBoth = (name, list) ->
    a = await containsApex name, list
    w = await containsWild name, list
    i = intersection a, w
    if empty i then false else first i

  match = (name, list) ->
    if needsApex()
      await hasBoth name, list
    else
      certs = await containsWild(name, list)
      if empty certs then false else first certs

  fetch = (name) ->
    if arn = await match name, await list()
      arn
    else
      throw new Error "Unable to find the required certs in ACM."

  {fetch}
export default ACM
